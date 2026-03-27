import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { authService } from "@/services/auth";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ResetPassword = () => {
  const router = useRouter();

  const background = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

  useEffect(() => {
    const checkSession = async () => {
      const isValid = await authService.verifyResetSession();
      setHasValidSession(isValid);
      setIsChecking(false);

      if (!isValid) {
        Alert.alert(
          "Invalid Link",
          "This reset link is invalid or expired. Please request a new one.",
          [{ text: "OK", onPress: () => router.replace("/forgot-password") }],
        );
      }
    };

    checkSession();
  }, [router]);

  const validateForm = () => {
    const newErrors = { password: "", confirmPassword: "" };
    let isValid = true;

    const passwordCheck = authService.validatePassword(password);
    if (!passwordCheck.valid) {
      newErrors.password = passwordCheck.message || "Invalid password";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await authService.updatePassword(password);

      Alert.alert("Success!", "Your password has been reset successfully.", [
        { text: "OK", onPress: () => router.replace("/sign-in") },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to reset password. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: "none", color: muted };
    const validation = authService.validatePassword(password);
    if (!validation.valid) return { strength: "weak", color: "#FF6B6B" };
    return { strength: "strong", color: "#51CF66" };
  };

  const passwordStrength = getPasswordStrength();

  if (isChecking) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.centerContent}>
          <Text style={[styles.loadingText, { color: textColor }]}>
            Verifying link...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasValidSession) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/changePSW.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>Reset Password</Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          Enter your new password below
        </Text>
      </View>

      <View style={styles.formGroup}>
        <FormField
          title="Enter New Password"
          value={password}
          placeholder="Enter new password"
          handleChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: "" });
          }}
          secureTextEntry
        />

        {password ? (
          <View style={styles.strengthContainer}>
            <View
              style={[
                styles.strengthBar,
                {
                  backgroundColor: passwordStrength.color,
                  width:
                    passwordStrength.strength === "strong" ? "100%" : "33%",
                },
              ]}
            />
            <Text
              style={[styles.strengthText, { color: passwordStrength.color }]}
            >
              {passwordStrength.strength === "strong"
                ? "Strong password"
                : "Weak password"}
            </Text>
          </View>
        ) : null}

        {errors.password ? (
          <Text style={[styles.errorText, { color: "#FF6B6B" }]}>
            {errors.password}
          </Text>
        ) : null}
      </View>

      <View style={styles.formGroup}>
        <FormField
          title="Confirm New Password"
          value={confirmPassword}
          placeholder="Confirm new password"
          handleChangeText={(text) => {
            setConfirmPassword(text);
            setErrors({ ...errors, confirmPassword: "" });
          }}
          secureTextEntry
        />

        {errors.confirmPassword ? (
          <Text style={[styles.errorText, { color: "#FF6B6B" }]}>
            {errors.confirmPassword}
          </Text>
        ) : null}
      </View>

      <View style={styles.requirementsContainer}>
        <Text style={[styles.requirementsTitle, { color: textColor }]}>
          Password must contain:
        </Text>
        <Text style={[styles.requirementText, { color: muted }]}>
          • At least 8 characters
        </Text>
        <Text style={[styles.requirementText, { color: muted }]}>
          • Uppercase & lowercase letters
        </Text>
        <Text style={[styles.requirementText, { color: muted }]}>
          • One number
        </Text>
      </View>

      <Button
        title="Reset Password"
        handlePress={submit}
        loading={isSubmitting}
        style={{ marginTop: Spacing.lg, width: "100%" }}
      />
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  imageWrapper: {
    alignItems: "center",
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  image: {
    width: 150,
    height: 150,
  },
  content: {
    width: "100%",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: "PoppinsSemibold",
    textAlign: "center",
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: Spacing.md,
  },
  strengthContainer: {
    marginTop: Spacing.xs,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
  },
  errorText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    marginTop: 4,
  },
  requirementsContainer: {
    marginBottom: Spacing.md,
  },
  requirementsTitle: {
    fontSize: 13,
    fontFamily: "PoppinsSemibold",
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    lineHeight: 18,
  },
});
