import Button from "@/components/ui/Button";
import Spacing from "@/constants/SPACING";
import { useLocation } from "@/hooks/useLocation";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSession } from "@/providers/session";
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

export default function EnableLocationScreen() {
  const router = useRouter();
  const { activePersona } = useSession();

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");

  const {
    isLoading: checkingLocation,
    requestLocationPermission,
    getCurrentLocationWithAddress,
  } = useLocation();

  const [isEnabling, setIsEnabling] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  const handleEnableLocation = async () => {
    setIsEnabling(true);
    try {
      // Request location permission
      const granted = await requestLocationPermission();

      if (granted) {
        // Get current location to verify it works
        const location = await getCurrentLocationWithAddress();

        if (location) {
          Alert.alert(
            "Location Enabled!",
            location.address
              ? `We found you at: ${location.address}`
              : "Location access has been enabled successfully.",
            [
              {
                text: "Continue",
                onPress: navigateToHome,
              },
            ],
          );
        } else {
          // Permission granted but couldn't get location
          Alert.alert(
            "Location Enabled",
            "Location access has been enabled. You can now see nearby properties.",
            [
              {
                text: "Continue",
                onPress: navigateToHome,
              },
            ],
          );
        }
      }
    } catch (error) {
      console.error("Error enabling location:", error);
      Alert.alert("Error", "Failed to enable location. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleSkipLocation = async () => {
    Alert.alert(
      "Skip Location Access?",
      "Without location access, you won't see nearby properties and services. You can enable this later in settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Skip",
          style: "destructive",
          onPress: () => {
            setIsSkipping(true);
            navigateToHome();
          },
        },
      ],
    );
  };

  const navigateToHome = () => {
    try {
      // Navigate based on persona type
      if (!activePersona) {
        // Fallback to seeker if no persona (shouldn't happen)
        router.replace("/(seeker)/(tabs)/home");
        return;
      }

      switch (activePersona.type) {
        case "seeker":
          router.replace("/(seeker)/(tabs)/home");
          break;
        case "owner":
          router.replace("/(owner)/(tabs)/dashboard");
          break;
        case "artisan":
          router.replace("/(artisan)/(tabs)/jobs");
          break;
        default:
          router.replace("/(seeker)/(tabs)/home");
      }
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsSkipping(false);
    }
  };

  // Show loading while checking location status
  if (checkingLocation) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E5A1E" />
          <Text style={[styles.loadingText, { color: muted }]}>
            Checking location services...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.content}>
        <Image
          source={require("@/assets/images/Artwork.png")}
          resizeMode="contain"
          style={styles.image}
        />

        <Text style={[styles.title, { color: textColor }]}>
          Enable Location
        </Text>
        <Text style={[styles.subtitle, { color: muted }]}>
          To get the best nearby results, we&apos;d like to access your
          location.
        </Text>
      </View>

      <View style={styles.buttonGroup}>
        <Button
          title="Enable Location"
          handlePress={handleEnableLocation}
          loading={isEnabling}
          style={{ width: "100%", marginBottom: Spacing.sm }}
        />
        <Button
          variant="outline"
          title="Not Now"
          handlePress={handleSkipLocation}
          loading={isSkipping}
          style={{ width: "100%" }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "space-between",
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
  content: {
    alignItems: "center",
    marginTop: Spacing.xxxl,
    paddingHorizontal: Spacing.md,
  },
  image: {
    width: "100%",
    height: 260,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontFamily: "PoppinsSemibold",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    lineHeight: 20,
  },
  buttonGroup: {
    width: "100%",
    paddingBottom: Spacing.xxl,
  },
});
