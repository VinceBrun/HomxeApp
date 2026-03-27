import Button from "@/components/ui/Button";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import otpService from "@/services/otp";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmailVerification = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { email, fullName, phoneNumber } = params;

  const background = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
      return undefined;
    }
  }, [countdown]);

  // Format countdown time (120 seconds → "02:00")
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle OTP input change
  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Clear all inputs and refocus first
  const clearInputs = () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  // Submit OTP
  const submit = async () => {
    const otpCode = otp.join("");

    // Validate OTP format
    if (!otpService.validateOTPFormat(otpCode)) {
      Alert.alert(
        "Invalid Code",
        "Please enter all 6 digits of the verification code.",
        [{ text: "OK" }],
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Verify OTP
      await otpService.verifyOTP(email as string, otpCode);

      Alert.alert(
        "Email Verified!",
        "Your email has been verified successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              router.push({
                pathname: "/choose-persona",
                params: {
                  email,
                  fullName,
                  phoneNumber,
                  isNewUser: "true",
                },
              });
            },
          },
        ],
      );
    } catch (error: any) {
      console.error("OTP verification error:", error);

      let errorMessage = "Failed to verify code. Please try again.";

      // Better error messages
      if (error.message?.toLowerCase().includes("expired")) {
        errorMessage =
          "This code has expired. Please tap 'Resend' to get a new code.";
      } else if (
        error.message?.toLowerCase().includes("invalid") ||
        error.message?.toLowerCase().includes("token")
      ) {
        errorMessage = "Incorrect code. Please check and try again.";
      }

      Alert.alert("Verification Failed", errorMessage, [
        {
          text: "OK",
          onPress: () => {
            clearInputs(); // Clear inputs on error
          },
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    try {
      await otpService.resendOTP(email as string);

      // Reset countdown
      setCountdown(120);
      setCanResend(false);
      clearInputs();

      Alert.alert(
        "Code Sent",
        "A new verification code has been sent to your email.",
        [{ text: "OK" }],
      );
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      Alert.alert(
        "Resend Failed",
        error.message || "Failed to resend code. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsResending(false);
    }
  };

  // Mask email (show first 3 and domain)
  const maskEmail = (email: string) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (!local || !domain) return email;
    const maskedLocal = local.slice(0, 3) + "***";
    return `${maskedLocal}@${domain}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/email-verifcation.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>
          OTP VERIFICATION
        </Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          Enter the 6-digit code sent to
        </Text>
        <Text style={[styles.email, { color: textColor }]}>
          {maskEmail(email as string)}
        </Text>
      </View>

      {/* OTP Input Fields */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            style={[
              styles.otpInput,
              {
                borderColor: digit ? primary : "#D1D5DB",
                color: textColor,
              },
            ]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>

      {/* Countdown Timer */}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, { color: muted }]}>
          {formatTime(countdown)} Sec
        </Text>
      </View>

      {/* Resend Link */}
      <View style={styles.resendContainer}>
        <Text style={[styles.resendText, { color: muted }]}>
          Didn&apos;t receive any code?{" "}
        </Text>
        <TouchableOpacity
          onPress={handleResend}
          disabled={!canResend || isResending}
        >
          <Text
            style={[
              styles.resendLink,
              {
                color: canResend && !isResending ? primary : muted,
              },
            ]}
          >
            {isResending ? "Sending..." : "Resend"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit Button */}
      <Button
        title="Verify"
        handlePress={submit}
        fullWidth
        loading={isSubmitting}
        style={{ marginTop: Spacing.md }}
      />
    </SafeAreaView>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
    justifyContent: "center",
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  image: {
    width: 200,
    height: 200,
  },
  content: {
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontFamily: "PoppinsSemibold",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1.5,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "PoppinsSemibold",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  timerText: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  resendText: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  resendLink: {
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
    textDecorationLine: "underline",
  },
});
