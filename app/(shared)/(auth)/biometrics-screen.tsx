/**
 * Biometrics Screen
 * Handles biometric authentication setup (FaceID/TouchID) during user onboarding.
 */

import Button from "@/components/ui/Button";
import Spacing from "@/constants/SPACING";
import { useBiometrics } from "@/hooks/useBiometrics";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BiometricsScreen: React.FC = () => {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");

  const {
    status,
    isLoading: checkingBiometrics,
    enableBiometrics,
    getBiometricTypeName,
  } = useBiometrics();

  const [isEnabling, setIsEnabling] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  // Check if biometrics is available
  const canUseBiometrics = status.isAvailable;
  const biometricName = getBiometricTypeName();

  const handleEnableBiometrics = async () => {
    if (!canUseBiometrics) {
      Alert.alert(
        `${biometricName} Not Available`,
        `Please set up ${biometricName.toLowerCase()} in your device settings first.`,
        [
          {
            text: "Skip",
            onPress: handleSkipBiometrics,
          },
        ],
      );
      return;
    }

    setIsEnabling(true);
    try {
      const enabled = await enableBiometrics();

      if (enabled) {
        Alert.alert(
          "Success!",
          `${biometricName} has been enabled for secure login.`,
          [
            {
              text: "Continue",
              onPress: () => {
                // Navigate to location screen or home based on persona
                router.push("/(seeker)/(screens)/enable-location");
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error("Error enabling biometrics:", error);
      Alert.alert("Error", "Failed to enable biometrics. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleSkipBiometrics = async () => {
    setIsSkipping(true);
    try {
      // Navigate to location screen or home
      router.push("/(seeker)/(screens)/enable-location");
    } catch (error) {
      console.error("Error navigating:", error);
    } finally {
      setIsSkipping(false);
    }
  };

  // Show loading while checking biometrics availability
  if (checkingBiometrics) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E5A1E" />
          <Text style={[styles.loadingText, { color: muted }]}>
            Checking biometric support...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/biometrics.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <View style={styles.textGroup}>
        <Text style={[styles.title, { color: textColor }]}>
          {canUseBiometrics ? biometricName : "Biometric Security"}
        </Text>
        <Text style={[styles.description, { color: muted }]}>
          {canUseBiometrics
            ? `You can securely log into your account with ${biometricName.toLowerCase()}`
            : `Biometric authentication is not available on this device. You'll use your password instead.`}
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        {canUseBiometrics ? (
          <>
            <Button
              title="Enable Biometric Login"
              handlePress={handleEnableBiometrics}
              loading={isEnabling}
              style={{ width: "100%", marginBottom: Spacing.sm }}
            />
            <Button
              variant="outline"
              title="Skip For Now"
              handlePress={handleSkipBiometrics}
              loading={isSkipping}
              style={{ width: "100%" }}
            />
          </>
        ) : (
          <Button
            title="Continue"
            handlePress={handleSkipBiometrics}
            loading={isSkipping}
            style={{ marginTop: Spacing.lg, width: "100%" }}
          />
        )}
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  imageWrapper: {
    alignItems: "center",
    width: "100%",
    marginBottom: Spacing.xl,
  },
  image: {
    width: "100%",
    height: 260,
  },
  textGroup: {
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 22,
    fontFamily: "PoppinsSemibold",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    lineHeight: 20,
  },
  buttonGroup: {
    width: "100%",
    marginTop: "auto",
    marginBottom: Spacing.xl,
  },
});

export default BiometricsScreen;
