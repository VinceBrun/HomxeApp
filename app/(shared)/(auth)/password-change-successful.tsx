import Button from "@/components/ui/Button";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PasswordChangeSuccessful = () => {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");

  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      router.push("/biometrics-screen");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <Image
        source={require("@/assets/images/passwordChange.png")}
        resizeMode="contain"
        style={styles.image}
      />

      <Text style={[styles.title, { color: textColor }]}>Password Changed</Text>

      <Text style={[styles.subtitle, { color: muted }]}>
        Your password has been successfully changed! To ensure your account’s
        security, you will need to sign in with your updated information.
      </Text>

      <Button
        title="Sign In"
        handlePress={submit}
        isLoading={isSubmitting}
        containerStyles="mt-7 w-full"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxxl,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 22,
    fontFamily: "PoppinsSemibold",
    textAlign: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
});

export default PasswordChangeSuccessful;
