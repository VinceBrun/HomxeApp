import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PhotoGuidelines() {
  const textColor = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");

  return (
    <LinearGradient
      colors={[`${primary}15`, `${primary}08`]}
      style={styles.guidelinesCard}
    >
      <View style={styles.guidelineHeader}>
        <Ionicons name="information-circle" size={24} color={primary} />
        <Text style={[styles.guidelineTitle, { color: primary }]}>
          Photo Guidelines
        </Text>
      </View>

      <View style={styles.guidelinesList}>
        <View style={styles.guidelineItem}>
          <Ionicons name="checkmark-circle" size={16} color={primary} />
          <Text style={[styles.guidelineText, { color: textColor }]}>
            Upload 3-20 high-quality photos
          </Text>
        </View>
        <View style={styles.guidelineItem}>
          <Ionicons name="checkmark-circle" size={16} color={primary} />
          <Text style={[styles.guidelineText, { color: textColor }]}>
            Include photos of all rooms
          </Text>
        </View>
        <View style={styles.guidelineItem}>
          <Ionicons name="checkmark-circle" size={16} color={primary} />
          <Text style={[styles.guidelineText, { color: textColor }]}>
            Show exterior and amenities
          </Text>
        </View>
        <View style={styles.guidelineItem}>
          <Ionicons name="checkmark-circle" size={16} color={primary} />
          <Text style={[styles.guidelineText, { color: textColor }]}>
            Tap any photo to set as cover
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  guidelinesCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  guidelineHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.xxs,
  },
  guidelineTitle: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemiBold",
  },
  guidelinesList: {
    gap: Spacing.xxs,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  guidelineText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
});
