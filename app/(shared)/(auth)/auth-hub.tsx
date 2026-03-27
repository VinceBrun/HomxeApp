/**
 * Auth Hub Screen
 * Orchestrates post-authentication navigation based on session status and active persona.
 */

import { useSession } from "@/providers/session";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function AuthHub() {
  const {
    session,
    user,
    activePersona,
    isLoading: sessionLoading,
  } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  // ✅ FIX: Wrap handleNavigation in useCallback to fix ESLint warning
  const handleNavigation = useCallback(() => {
    // Not logged in → Sign In
    if (!session || !user) {
      console.log("🔐 Auth Hub: No session, redirecting to sign in");
      router.replace("/sign-in");
      return;
    }

    // Logged in but no active persona → Choose Persona
    if (!activePersona) {
      console.log(
        "🎭 Auth Hub: No active persona, redirecting to choose persona",
      );
      router.replace("/choose-persona");
      return;
    }

    // ✅ Check if persona type is valid before routing
    if (!activePersona.type) {
      console.error(
        "❌ Auth Hub: Persona exists but type is null, redirecting to choose persona",
      );
      router.replace("/choose-persona");
      return;
    }

    // Has persona → Route to their app based on persona type
    console.log("✅ Auth Hub: Routing to persona home:", activePersona.type);

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
        // Fallback if persona type is invalid
        console.error("❌ Auth Hub: Invalid persona type:", activePersona.type);
        router.replace("/choose-persona");
    }
  }, [session, user, activePersona]); // ✅ FIX: Added dependencies

  useEffect(() => {
    // Small delay to let session provider finish loading
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [session, user, activePersona]);

  useEffect(() => {
    // Only navigate when done checking
    if (!sessionLoading && !isChecking) {
      handleNavigation();
    }
  }, [sessionLoading, isChecking, handleNavigation]); // ✅ FIX: Now includes handleNavigation

  // Show loading while checking session
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1E5A1E" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 16,
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#757575",
  },
});
