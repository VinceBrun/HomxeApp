import Button from "@/components/ui/Button";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePasswordScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const router = useRouter();

  const backgroundColor = useThemeColor({}, "background");
  const inputBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const placeholderColor = useThemeColor({}, "icon");

  const submit = async () => {
    setSubmitting(true);
    try {
      router.push("/password-change-successful");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/changePSW.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <TextInput
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Enter New Password"
        placeholderTextColor={placeholderColor}
        secureTextEntry
        style={[
          styles.input,
          {
            backgroundColor: inputBg,
            color: textColor,
          },
        ]}
      />

      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm New Password"
        placeholderTextColor={placeholderColor}
        secureTextEntry
        style={[
          styles.input,
          {
            backgroundColor: inputBg,
            color: textColor,
          },
        ]}
      />

      <Button
        title="Submit"
        handlePress={submit}
        loading={isSubmitting}
        style={{ marginTop: Spacing.lg, width: "100%" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  image: {
    width: "100%",
    height: 260,
  },
  input: {
    width: "100%",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
});

export default ChangePasswordScreen;
