/**
 * Payment Screen
 * Loads an auto-submitting HTML form into a WebView which POSTs to the
 * Interswitch checkout endpoint. Detects the redirect after payment
 * and verifies the transaction before showing success or failure.
 *
 * Path: app/(seeker)/property/pay/index.tsx
 *
 * Sandbox test card:
 *   Number: 5061050254756707864  |  Expiry: 06/26  |  CVV: 111  |  PIN: 1111
 *   OTP: 123456  (if prompted)
 */

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, WebViewNavigation } from "react-native-webview";

import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useInterswitchPayment } from "@/hooks/useInterswitchPayment";
import { useThemeColor } from "@/hooks/useThemeColor";
import type { PaymentPurpose } from "@/services/interswitchPayment";

// ISW redirects to this URL after payment completes (success or failure).
// Must match exactly what ISW sends back — including www subdomain.
const REDIRECT_URL = "https://www.homxe.com/payment/callback";

type Params = {
  propertyId: string;
  propertyTitle: string;
  amountNaira: string;
  landlordId: string;
  customerEmail: string;
  customerId: string;
  customerName: string;
  purpose: PaymentPurpose;
};

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const hasStarted = useRef(false);
  const redirectHandled = useRef(false);

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");
  const cardBg = useThemeColor({}, "card");
  const muted = useThemeColor({}, "icon");

  const amountNaira = parseFloat(params.amountNaira ?? "0");
  const isRent = (params.purpose ?? "rent") === "rent";

  const {
    status,
    checkoutHtml,
    errorMessage,
    result,
    startPayment,
    onPaymentRedirect,
    reset,
  } = useInterswitchPayment();

  const stableEmail = params.customerEmail ?? "";
  const stableCustomerId = params.customerId ?? "";
  const stableCustomerName = params.customerName ?? "Homxe User";
  const stablePropertyId = params.propertyId;
  const stableTitle = params.propertyTitle ?? "Property";
  const stablePurpose = params.purpose ?? "rent";

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    startPayment({
      amountNaira,
      customerEmail: stableEmail,
      customerId: stableCustomerId,
      customerName: stableCustomerName,
      description: isRent
        ? `Rent – ${stableTitle}`
        : `Service – ${stableTitle}`,
      purpose: stablePurpose,
      redirectUrl: REDIRECT_URL,
      propertyId: stablePropertyId,
    });
  }, [
    amountNaira,
    isRent,
    stableEmail,
    stableCustomerId,
    stableCustomerName,
    stablePropertyId,
    stableTitle,
    stablePurpose,
    startPayment,
  ]);

  const handleRedirect = (url: string) => {
    if (redirectHandled.current) return;
    redirectHandled.current = true;

    onPaymentRedirect(url);
  };

  // Fires on every URL change — catches both GET and POST redirects
  const handleNavigationChange = (navState: WebViewNavigation) => {
    if (navState.url.startsWith(REDIRECT_URL)) {
      handleRedirect(navState.url);
    }
  };

  // Secondary intercept — fires before loading starts, works for all request types
  const handleShouldStartLoad = (request: WebViewNavigation): boolean => {
    if (request.url.startsWith(REDIRECT_URL)) {
      handleRedirect(request.url);
      // Return false to stop the WebView navigating to our fake callback URL
      return false;
    }
    return true;
  };

  const handleClose = () => {
    if (status === "awaiting_payment") {
      Alert.alert("Cancel Payment?", "Your payment is still in progress.", [
        { text: "Continue", style: "cancel" },
        {
          text: "Cancel Payment",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]);
    } else {
      router.back();
    }
  };

  if (status === "idle" || status === "initiating") {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
        <Text style={[styles.statusText, { color: muted }]}>
          Preparing secure payment...
        </Text>
      </SafeAreaView>
    );
  }

  if (status === "verifying") {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
        <Text style={[styles.statusText, { color: muted }]}>
          Verifying payment...
        </Text>
        <Text style={[styles.subText, { color: muted }]}>
          Please do not close this screen.
        </Text>
      </SafeAreaView>
    );
  }

  if (status === "success" && result) {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: background }]}>
        <Ionicons name="checkmark-circle" size={80} color={primary} />
        <Text style={[styles.successTitle, { color: textColor }]}>
          Payment Successful!
        </Text>
        <Text style={[styles.successAmount, { color: primary }]}>
          ₦{amountNaira.toLocaleString()}
        </Text>
        <Text style={[styles.successSub, { color: muted }]}>
          {isRent ? "Rent payment" : "Service payment"} for{"\n"}
          {params.propertyTitle}
        </Text>
        <View style={[styles.refCard, { backgroundColor: cardBg }]}>
          <Text style={[styles.refLabel, { color: muted }]}>
            Transaction Reference
          </Text>
          <Text style={[styles.refValue, { color: textColor }]}>
            {result.merchantReference ?? result.txnRef}
          </Text>
          {result.transactionDate ? (
            <Text style={[styles.refDate, { color: muted }]}>
              {new Date(result.transactionDate).toLocaleString()}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: primary }]}
          onPress={() => {
            reset();
            if (router.canGoBack()) router.back();
          }}
        >
          <Text style={styles.primaryBtnText}>Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (status === "failed") {
    return (
      <SafeAreaView style={[styles.centered, { backgroundColor: background }]}>
        <Ionicons name="close-circle" size={80} color="#DC3545" />
        <Text style={[styles.failTitle, { color: textColor }]}>
          Payment Failed
        </Text>
        <Text style={[styles.failSub, { color: muted }]}>
          {errorMessage ?? "Something went wrong. Please try again."}
        </Text>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: primary }]}
          onPress={() => {
            reset();
            redirectHandled.current = false;
            hasStarted.current = false;
          }}
        >
          <Text style={styles.primaryBtnText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.back()}
        >
          <Text style={[styles.secondaryBtnText, { color: muted }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Awaiting payment — WebView
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <SafeAreaView edges={["top"]}>
        <View style={[styles.header, { borderBottomColor: cardBg }]}>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={textColor} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerLabel, { color: muted }]}>
              Secure Payment
            </Text>
            <Text style={[styles.headerAmount, { color: primary }]}>
              ₦{amountNaira.toLocaleString()}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons name="shield-checkmark" size={22} color={primary} />
          </View>
        </View>
      </SafeAreaView>

      {checkoutHtml ? (
        <WebView
          // Load HTML that auto-submits the POST form to ISW
          source={{
            html: checkoutHtml,
            baseUrl: "https://newwebpay.qa.interswitchng.com",
          }}
          onNavigationStateChange={handleNavigationChange}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          javaScriptEnabled
          domStorageEnabled
          thirdPartyCookiesEnabled
          sharedCookiesEnabled
          startInLoadingState
          mixedContentMode="always"
          originWhitelist={["*"]}
          renderLoading={() => (
            <View
              style={[styles.webViewLoader, { backgroundColor: background }]}
            >
              <ActivityIndicator size="large" color={primary} />
              <Text style={[styles.statusText, { color: muted }]}>
                Loading payment page...
              </Text>
            </View>
          )}
          style={{ flex: 1 }}
        />
      ) : (
        <View style={[styles.centered, { flex: 1 }]}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      )}

      <SafeAreaView edges={["bottom"]}>
        <View style={[styles.footer, { backgroundColor: cardBg }]}>
          <Ionicons name="lock-closed" size={12} color={muted} />
          <Text style={[styles.footerText, { color: muted }]}>
            Secured by Interswitch · Your card details are never stored.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  statusText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsMedium",
    textAlign: "center",
  },
  subText: {
    marginTop: Spacing.xxs,
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  closeBtn: { padding: Spacing.xxs },
  headerCenter: { flex: 1, alignItems: "center" },
  headerLabel: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
  },
  headerAmount: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
  },
  headerRight: { padding: Spacing.xxs },
  webViewLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xxs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  footerText: { fontSize: 11, fontFamily: "PoppinsRegular" },
  successTitle: {
    fontSize: Typography.fontSize.h1,
    fontFamily: "PoppinsBold",
    marginTop: Spacing.md,
    textAlign: "center",
  },
  successAmount: {
    fontSize: 32,
    fontFamily: "PoppinsBold",
    marginTop: Spacing.xxs,
  },
  successSub: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    marginTop: Spacing.xxs,
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.h5,
  },
  refCard: {
    width: "100%",
    padding: Spacing.md,
    borderRadius: Radius.md,
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  refLabel: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    marginBottom: Spacing.xxs,
  },
  refValue: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
    textAlign: "center",
  },
  refDate: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    marginTop: Spacing.xxs,
  },
  failTitle: {
    fontSize: Typography.fontSize.h1,
    fontFamily: "PoppinsBold",
    marginTop: Spacing.md,
    textAlign: "center",
  },
  failSub: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    marginTop: Spacing.xxs,
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.h5,
  },
  primaryBtn: {
    width: "100%",
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemiBold",
  },
  secondaryBtn: {
    paddingVertical: Spacing.sm,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
  },
});
