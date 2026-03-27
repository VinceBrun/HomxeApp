/**
 * Persona Selection Screen
 * Allows users to choose their role (Tenant, Landlord, Vendor) upon first login.
 */

import Button from "@/components/ui/Button";
import ActionCard from "@/components/ui/cards/ActionCard";
import Spacer from "@/components/ui/Spacer";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSession } from "@/providers/session";
import { personaService } from "@/services/persona";
import { PersonaType } from "@/types";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const cards: { key: string; title: string; subtitle: string; icon: any }[] = [
  {
    key: "seeker",
    title: "Tenant",
    subtitle: "Buy or rent a property",
    icon: "search",
  },
  {
    key: "owner",
    title: "Landlord",
    subtitle: "List & manage property, attract tenants & buyers",
    icon: "home",
  },
  {
    key: "artisan",
    title: "Vendor",
    subtitle: "Find clients, deliver services & get paid",
    icon: "construct",
  },
];

export default function ChoosePersona() {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "secondary");

  const { profile, user, refetchPersonas } = useSession();

  const [selected, setSelected] = useState<null | string>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isContinueDisabled = useMemo(
    () => selected === null || submitting,
    [selected, submitting],
  );

  const deriveDisplayName = () => {
    const emailPrefix = user?.email ? user.email.split("@")[0] : undefined;
    return (
      profile?.full_name ||
      (user?.user_metadata?.full_name as string | undefined) ||
      emailPrefix ||
      "Homxe User"
    );
  };

  const handleContinue = async () => {
    if (!selected) return;

    setSubmitting(true);
    setError(null);

    try {
      console.log("🎭 Creating persona:", selected);

      // Create or update persona for the user
      const persona = await personaService.upsertPersona(
        selected as PersonaType,
        {
          display_name: deriveDisplayName(),
        },
      );

      console.log("✅ Persona created:", persona);

      // Set as active persona
      await personaService.setActivePersona(persona.id);
      console.log("✅ Active persona set");

      // Refetch to update context
      await refetchPersonas();
      console.log("✅ Personas refetched");

      // Route based on persona type
      if (selected === "seeker") {
        console.log("🏠 Routing to Seeker home...");
        router.replace("/(seeker)/(tabs)/home" as any);
      } else if (selected === "owner") {
        console.log("🏢 Routing to Owner dashboard...");
        router.replace("/(owner)/(tabs)/dashboard" as any);
      } else if (selected === "artisan") {
        console.log("🔧 Routing to Artisan jobs...");
        router.replace("/(artisan)/(tabs)/jobs" as any);
      }
    } catch (err: any) {
      console.error("❌ ChoosePersona error:", err);

      const errorMessage =
        err?.message || "Failed to create persona. Please try again.";
      setError(errorMessage);

      // Show alert as backup
      Alert.alert("Error", errorMessage, [
        {
          text: "Try Again",
          onPress: () => setError(null),
        },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: background }]}>
      <View style={styles.container}>
        {/* Title */}
        <Text style={[styles.title, { color: text }]}>
          What do you want to do on Homxe?
        </Text>

        <Spacer size="sm" />

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: muted }]}>
          Choose your role to get started
        </Text>

        <Spacer size="lg" />

        {/* Persona Cards */}
        <View style={styles.cardsWrap}>
          {cards.map((c) => (
            <ActionCard
              key={c.key}
              variant="persona"
              icon={c.icon}
              title={c.title}
              subtitle={c.subtitle}
              selected={selected === c.key}
              onPress={() => {
                setSelected(c.key);
                setError(null); // Clear error when selecting
              }}
            />
          ))}
        </View>

        {/* Error Message */}
        {error && (
          <>
            <Spacer size="md" />
            <View
              style={[
                styles.errorContainer,
                { backgroundColor: `${errorColor}15` },
              ]}
            >
              <Text style={[styles.errorText, { color: errorColor }]}>
                {error}
              </Text>
            </View>
          </>
        )}

        {/* Continue Button */}
        <View style={styles.footer}>
          <Button
            title={submitting ? "Creating..." : "Continue"}
            handlePress={handleContinue}
            loading={submitting}
            disabled={isContinueDisabled}
          />

          {submitting && (
            <>
              <Spacer size="sm" />
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={muted} />
                <Text style={[styles.loadingText, { color: muted }]}>
                  Setting up your account...
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  title: {
    fontFamily: "PoppinsSemibold",
    fontSize: 24,
    lineHeight: 32,
    textAlign: "left",
  },
  subtitle: {
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    lineHeight: 20,
  },
  cardsWrap: {
    gap: Spacing.md,
  },
  errorContainer: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF000020",
  },
  errorText: {
    fontFamily: "PoppinsMedium",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  footer: {
    marginTop: "auto",
    paddingBottom: Spacing.xl,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  loadingText: {
    fontFamily: "PoppinsRegular",
    fontSize: 13,
  },
});
