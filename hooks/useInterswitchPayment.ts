/**
 * useInterswitchPayment Hook
 * Manages the complete Interswitch payment lifecycle:
 *   idle → initiating → awaiting_payment → verifying → success | failed
 *
 * Path: hooks/useInterswitchPayment.ts
 */

import { supabase } from "@/lib/supabase";
import {
    InitiatePaymentParams,
    VerifyPaymentResult,
    initiatePayment,
    verifyPayment,
} from "@/services/interswitchPayment";
import { useCallback, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentStatus =
  | "idle"
  | "initiating"
  | "awaiting_payment"
  | "verifying"
  | "success"
  | "failed";

export interface PaymentSuccessResult {
  txnRef: string;
  merchantReference: string | undefined;
  paymentReference: string | undefined;
  amountNaira: number;
  responseDescription: string | undefined;
  transactionDate: string | undefined;
}

interface State {
  status: PaymentStatus;
  checkoutHtml: string | null;
  errorMessage: string | null;
  result: PaymentSuccessResult | null;
}

const INITIAL: State = {
  status: "idle",
  checkoutHtml: null,
  errorMessage: null,
  result: null,
};

// ─── Hook ────────────────────────────────────────────────────────────────────

export const useInterswitchPayment = () => {
  const [state, setState] = useState<State>(INITIAL);

  const pendingTxnRef = useRef<string | null>(null);
  const pendingAmountNaira = useRef<number>(0);
  const pendingParams = useRef<InitiatePaymentParams | null>(null);
  // Guard: only process one redirect even if WebView fires multiple events
  const isVerifying = useRef(false);

  const reset = useCallback(() => {
    setState(INITIAL);
    pendingTxnRef.current = null;
    pendingAmountNaira.current = 0;
    pendingParams.current = null;
    isVerifying.current = false;
  }, []);

  const startPayment = useCallback((params: InitiatePaymentParams) => {
    setState({ ...INITIAL, status: "initiating" });
    isVerifying.current = false;

    const result = initiatePayment(params);

    if (!result.success || !result.checkoutHtml || !result.txnRef) {
      setState({
        ...INITIAL,
        status: "failed",
        errorMessage: result.error ?? "Could not initialize payment.",
      });
      return;
    }

    pendingTxnRef.current = result.txnRef;
    pendingAmountNaira.current = params.amountNaira;
    pendingParams.current = params;

    setState({
      status: "awaiting_payment",
      checkoutHtml: result.checkoutHtml,
      errorMessage: null,
      result: null,
    });
  }, []);

  /**
   * Called when the WebView navigates to our redirect URL.
   * ISW redirects after payment (success or failure) with txnref in the URL.
   */
  const onPaymentRedirect = useCallback(async (redirectedUrl: string) => {
    // Prevent double-firing — WebView can trigger multiple navigation events
    if (isVerifying.current) return;
    isVerifying.current = true;

    const amountNaira = pendingAmountNaira.current;
    const params = pendingParams.current;

    if (!params) return;

    // Extract txnref from the redirect URL query params.
    // ISW appends: ?txnref=HMX_RENT_xxx&resp=00&desc=Approved...
    // Fall back to our generated ref if parsing fails.
    let txnRef = pendingTxnRef.current ?? "";

    try {
      const urlObj = new URL(redirectedUrl);
      const iswTxnRef =
        urlObj.searchParams.get("txnref") ??
        urlObj.searchParams.get("txnRef") ??
        urlObj.searchParams.get("transactionreference");
      if (iswTxnRef) txnRef = iswTxnRef;
    } catch {
      // URL parsing failed — fall back to our generated ref
    }

    setState((prev) => ({ ...prev, status: "verifying" }));

    const verification: VerifyPaymentResult = await verifyPayment(
      txnRef,
      amountNaira,
    );

    if (!verification.success) {
      isVerifying.current = false;
      setState((prev) => ({
        ...prev,
        status: "failed",
        errorMessage: verification.error ?? "Could not verify payment.",
      }));
      return;
    }

    if (!verification.approved) {
      isVerifying.current = false;
      setState((prev) => ({
        ...prev,
        status: "failed",
        errorMessage: `${verification.responseDescription ?? "Payment not approved"} (code: ${verification.responseCode ?? "?"})`,
      }));
      return;
    }

    savePaymentRecord(verification, params, amountNaira, txnRef);

    setState({
      status: "success",
      checkoutHtml: null,
      errorMessage: null,
      result: {
        txnRef,
        merchantReference: verification.merchantReference,
        paymentReference: verification.paymentReference,
        amountNaira,
        responseDescription: verification.responseDescription,
        transactionDate: verification.transactionDate,
      },
    });
  }, []);

  return {
    ...state,
    startPayment,
    onPaymentRedirect,
    reset,
  };
};

// ─── Private helper ───────────────────────────────────────────────────────────

async function savePaymentRecord(
  verification: VerifyPaymentResult,
  params: InitiatePaymentParams,
  amountNaira: number,
  txnRef: string,
): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("payments").insert({
      tenant_id: user.id,
      property_id: params.propertyId ?? null,
      amount: amountNaira,
      status: "completed",
      payment_method: "card",
      payment_gateway: "interswitch",
      reference: verification.merchantReference ?? txnRef,
      currency: "NGN",
      paid_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[ISW] savePaymentRecord failed:", err);
  }
}
