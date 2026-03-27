// Interswitch Payment Service
// We use the Web Checkout approach — build an HTML form, load it in a WebView,
// and let Interswitch handle the payment UI. After payment, they redirect back
// to us and we verify the transaction server-side before marking it as done.
//
// Sandbox: https://newwebpay.qa.interswitchng.com/collections/w/pay
// Live:    https://newwebpay.interswitchng.com/collections/w/pay

const ISW_CHECKOUT_URL =
  "https://newwebpay.qa.interswitchng.com/collections/w/pay";

const ISW_VERIFY_URL =
  "https://qa.interswitchng.com/collections/api/v1/gettransaction.json";

const ISW_MERCHANT_CODE = process.env.EXPO_PUBLIC_ISW_MERCHANT_CODE ?? "MX6072";
const ISW_PAY_ITEM_ID = process.env.EXPO_PUBLIC_ISW_PAY_ITEM_ID ?? "9405967";

export type PaymentPurpose = "rent" | "service";

export interface InitiatePaymentParams {
  amountNaira: number;
  customerEmail: string;
  customerId: string;
  customerName: string;
  description: string;
  purpose: PaymentPurpose;
  redirectUrl: string;
  propertyId?: string;
  jobId?: string;
}

export interface InitiatePaymentResult {
  success: boolean;
  checkoutHtml?: string;
  txnRef?: string;
  error?: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  approved: boolean;
  responseCode?: string;
  responseDescription?: string;
  amountKobo?: number;
  merchantReference?: string;
  paymentReference?: string;
  transactionDate?: string;
  error?: string;
}

// Interswitch expects amounts in kobo (Naira x 100)
export const toKobo = (naira: number): number => Math.round(naira * 100);

// Each transaction needs a unique reference — we prefix with the purpose
// so it's easy to identify in the Interswitch dashboard
export const generateTxnRef = (purpose: PaymentPurpose): string => {
  const prefix = purpose === "rent" ? "RENT" : "SVC";
  const timestamp = Date.now();
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `HMX_${prefix}_${timestamp}_${rand}`;
};

// Builds the HTML page that gets loaded into the WebView.
// The form auto-submits after 1.5s to give the WebView time to
// resolve DNS before the POST fires — Android WebView can be slow on this.
export const initiatePayment = (
  params: InitiatePaymentParams,
): InitiatePaymentResult => {
  try {
    const txnRef = generateTxnRef(params.purpose);
    const amountKobo = toKobo(params.amountNaira);

    const checkoutHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        background: #f5f5f5;
        font-family: sans-serif;
        font-size: 16px;
        color: #333;
      }
    </style>
  </head>
  <body>
    <p>Redirecting to secure payment...</p>
    <form id="payForm" method="post" action="${ISW_CHECKOUT_URL}">
      <input type="hidden" name="merchant_code"     value="${ISW_MERCHANT_CODE}" />
      <input type="hidden" name="pay_item_id"       value="${ISW_PAY_ITEM_ID}" />
      <input type="hidden" name="txn_ref"           value="${txnRef}" />
      <input type="hidden" name="amount"            value="${amountKobo}" />
      <input type="hidden" name="currency"          value="566" />
      <input type="hidden" name="cust_id"           value="${params.customerId}" />
      <input type="hidden" name="cust_email"        value="${params.customerEmail}" />
      <input type="hidden" name="cust_name"         value="${params.customerName}" />
      <input type="hidden" name="pay_item_name"     value="${params.description}" />
      <input type="hidden" name="site_redirect_url" value="${params.redirectUrl}" />
    </form>
    <script>setTimeout(function(){ document.getElementById('payForm').submit(); }, 1500);</script>
  </body>
</html>`;

    return { success: true, checkoutHtml, txnRef };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to build checkout";
    return { success: false, error: msg };
  }
};

// Called after Interswitch redirects back to our callback URL.
// We never trust the redirect alone — we always verify server-side
// before marking the payment as successful or recording it in the database.
export const verifyPayment = async (
  txnRef: string,
  amountNaira: number,
): Promise<VerifyPaymentResult> => {
  const amountKobo = toKobo(amountNaira);

  try {
    const url =
      `${ISW_VERIFY_URL}` +
      `?merchantcode=${ISW_MERCHANT_CODE}` +
      `&transactionreference=${txnRef}` +
      `&amount=${amountKobo}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const rawText = await response.text();

    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      return {
        success: false,
        approved: false,
        error: "Could not parse verification response.",
      };
    }

    const returnedAmountKobo = Number(data.Amount);
    const responseCode = String(data.ResponseCode ?? "");

    // Two conditions must both pass: ResponseCode "00" means the bank approved it,
    // and the amount must match exactly what we charged — no funny business.
    const approved = responseCode === "00" && returnedAmountKobo === amountKobo;

    return {
      success: true,
      approved,
      responseCode,
      responseDescription: data.ResponseDescription,
      amountKobo: returnedAmountKobo,
      merchantReference: data.MerchantReference,
      paymentReference: data.PaymentReference,
      transactionDate: data.TransactionDate,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return { success: false, approved: false, error: msg };
  }
};