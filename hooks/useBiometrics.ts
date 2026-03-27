import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";

const BIOMETRICS_ENABLED_KEY = "@biometrics_enabled";

export interface BiometricsStatus {
  isAvailable: boolean;
  isEnabled: boolean;
  biometricType: "fingerprint" | "facial" | "iris" | "none";
  isEnrolled: boolean;
}

export const useBiometrics = () => {
  const [status, setStatus] = useState<BiometricsStatus>({
    isAvailable: false,
    isEnabled: false,
    biometricType: "none",
    isEnrolled: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check biometrics availability on mount
  useEffect(() => {
    checkBiometricsAvailability();
  }, []);

  /**
   * Check if biometrics is available on device
   */
  const checkBiometricsAvailability = async () => {
    setIsLoading(true);
    try {
      // Check if device supports biometrics
      const compatible = await LocalAuthentication.hasHardwareAsync();

      if (!compatible) {
        setStatus({
          isAvailable: false,
          isEnabled: false,
          biometricType: "none",
          isEnrolled: false,
        });
        setIsLoading(false);
        return;
      }

      // Check if user has enrolled biometrics
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      // Get biometric types available
      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      let biometricType: "fingerprint" | "facial" | "iris" | "none" = "none";

      if (
        types.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        )
      ) {
        biometricType = "facial";
      } else if (
        types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
      ) {
        biometricType = "fingerprint";
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        biometricType = "iris";
      }

      // Check if user previously enabled biometrics
      const enabled = await AsyncStorage.getItem(BIOMETRICS_ENABLED_KEY);

      setStatus({
        isAvailable: compatible && enrolled,
        isEnabled: enabled === "true",
        biometricType,
        isEnrolled: enrolled,
      });
    } catch (error) {
      console.error("Error checking biometrics:", error);
      setStatus({
        isAvailable: false,
        isEnabled: false,
        biometricType: "none",
        isEnrolled: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Authenticate user with biometrics
   */
  const authenticate = async (): Promise<boolean> => {
    try {
      // Check if biometrics is available
      if (!status.isAvailable) {
        Alert.alert(
          "Biometrics Not Available",
          "Please set up biometric authentication in your device settings first.",
          [{ text: "OK" }],
        );
        return false;
      }

      // Prompt for biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
        fallbackLabel: "Use Passcode",
        disableDeviceFallback: false,
      });

      if (result.success) {
        return true;
      } else {
        // User cancelled or failed authentication
        if (result.error === "user_cancel") {
          // User cancelled - don't show alert
          return false;
        }

        Alert.alert(
          "Authentication Failed",
          "Please try again or use your password.",
          [{ text: "OK" }],
        );
        return false;
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      Alert.alert(
        "Error",
        "An error occurred during authentication. Please try again.",
        [{ text: "OK" }],
      );
      return false;
    }
  };

  /**
   * Enable biometrics for this app
   */
  const enableBiometrics = async (): Promise<boolean> => {
    try {
      // First, authenticate to verify user can use biometrics
      const authenticated = await authenticate();

      if (authenticated) {
        // Save preference
        await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, "true");

        setStatus((prev) => ({ ...prev, isEnabled: true }));

        return true;
      }

      return false;
    } catch (error) {
      console.error("Error enabling biometrics:", error);
      Alert.alert("Error", "Failed to enable biometrics. Please try again.", [
        { text: "OK" },
      ]);
      return false;
    }
  };

  /**
   * Disable biometrics for this app
   */
  const disableBiometrics = async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, "false");
      setStatus((prev) => ({ ...prev, isEnabled: false }));
    } catch (error) {
      console.error("Error disabling biometrics:", error);
    }
  };

  /**
   * Get user-friendly biometric type name
   */
  const getBiometricTypeName = (): string => {
    switch (status.biometricType) {
      case "facial":
        return Platform.OS === "ios" ? "Face ID" : "Face Recognition";
      case "fingerprint":
        return Platform.OS === "ios" ? "Touch ID" : "Fingerprint";
      case "iris":
        return "Iris Scan";
      default:
        return "Biometric";
    }
  };

  return {
    status,
    isLoading,
    authenticate,
    enableBiometrics,
    disableBiometrics,
    checkBiometricsAvailability,
    getBiometricTypeName,
  };
};
