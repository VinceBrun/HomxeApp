import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/COLORS";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Web3TeaserCardProps {
  onLearnMore: () => void;
  onGetNotified: () => void;
}

export default function Web3TeaserCard({
  onLearnMore,
  onGetNotified,
}: Web3TeaserCardProps) {
  const cardBg = useThemeColor({}, "card");
  const brandGold = Colors.light.tertiary; // #CBAA58
  const brandGreen = Colors.light.primary; // #196606

  return (
    <LinearGradient
      colors={[brandGreen, brandGold, "#D4B86A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Icon & Badge */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>🪙</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>COMING SOON</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Fractional Ownership</Text>

      {/* Description */}
      <Text style={styles.description}>
        Own property from ₦100k • Earn rental income monthly
      </Text>

      {/* Blurred Preview */}
      <View style={styles.previewContainer}>
        <View style={[styles.previewCard, { backgroundColor: cardBg }]}>
          <View style={styles.blurOverlay}>
            <Ionicons name="lock-closed" size={32} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={onLearnMore}>
          <Text style={styles.primaryButtonText}>Learn More</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onGetNotified}>
          <Text style={styles.secondaryButtonText}>Get Notified</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 28,
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "PoppinsSemibold",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontFamily: "PoppinsSemibold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  previewContainer: {
    marginBottom: Spacing.md,
  },
  previewCard: {
    height: 120,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },
  blurOverlay: {
    flex: 1,
    backgroundColor: "rgba(25, 102, 6, 0.3)", // Brand green overlay
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: Radius.sm,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#196606", // Brand green
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    borderRadius: Radius.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
  },
});
