import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { authService } from "@/services/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const router = useRouter();

  const background = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const [email, setEmail] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!authService.validateEmail(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await authService.sendPasswordResetEmail(email);
      setEmailSent(true);

      Alert.alert(
        "Email Sent!",
        "We have sent you a password reset link. Please check your email inbox.",
        [{ text: "OK" }],
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to send reset email. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = () => {
    setEmailSent(false);
    submit();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      {!emailSent ? (
        <>
          <View style={styles.imageWrapper}>
            <Image
              source={require("@/assets/images/forgot-password.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>

          <View style={styles.content}>
            <Text style={[styles.title, { color: textColor }]}>Forgot</Text>
            <Text style={[styles.title, { color: textColor }]}>Password?</Text>
            <Text style={[styles.subtitle, { color: muted }]}>
              Don&apos;t worry! It happens. Enter your email to reset your
              password.
            </Text>
          </View>

          <FormField
            title="Email"
            value={email}
            placeholder="Enter your email"
            handleChangeText={(text) => {
              setEmail(text);
              setError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            otherStyles="mb-2"
          />

          {error ? (
            <Text style={[styles.errorText, { color: "#FF6B6B" }]}>
              {error}
            </Text>
          ) : null}

          <Button
            title="Reset Via Email"
            handlePress={submit}
            loading={isSubmitting}
            style={{ width: "100%", marginTop: Spacing.lg }}
          />

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: muted }]}>
              Remember your password?{" "}
            </Text>
            <Text
              style={[styles.footerLink, { color: primary }]}
              onPress={() => router.back()}
            >
              Sign In
            </Text>
          </View>
        </>
      ) : (
        <>
          <View style={styles.imageWrapper}>
            <Image
              source={require("@/assets/images/forgot-password.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>

          <View style={styles.content}>
            <View
              style={[styles.successBadge, { backgroundColor: primary + "20" }]}
            >
              <Text style={[styles.successIcon, { color: primary }]}>✓</Text>
            </View>

            <Text
              style={[styles.title, { color: textColor, textAlign: "center" }]}
            >
              Check Your Email
            </Text>

            <Text
              style={[styles.subtitle, { color: muted, textAlign: "center" }]}
            >
              We sent a reset link to{"\n"}
              <Text style={{ color: textColor, fontFamily: "PoppinsSemibold" }}>
                {email}
              </Text>
            </Text>

            <Text style={[styles.helpText, { color: muted }]}>
              Didn&apos;t receive it? Check spam or
            </Text>
          </View>

          <Button
            title="Send Reset Link"
            handlePress={handleResend}
            style={{ width: "100%", marginTop: Spacing.sm }}
          />

          <View style={styles.footer}>
            <Text
              style={[styles.footerLink, { color: primary }]}
              onPress={() => router.back()}
            >
              Back to Sign In
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
    justifyContent: "center",
  },
  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 320,
  },
  content: {
    width: "100%",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 32,
    fontFamily: "PoppinsSemibold",
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    marginTop: 4,
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: Spacing.md,
  },
  successIcon: {
    fontSize: 40,
    fontWeight: "bold",
  },
  helpText: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    marginTop: Spacing.md,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  footerText: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  footerLink: {
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
  },
});
