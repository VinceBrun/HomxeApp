import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface AdditionalInfoGridProps {
  photos: number;
  amenities: number;
}

export default function AdditionalInfoGrid({
  photos,
  amenities,
}: AdditionalInfoGridProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View style={styles.infoGrid}>
      <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
        <Ionicons name="images-outline" size={24} color={primary} />
        <Text style={[styles.infoNumber, { color: textColor }]}>{photos}</Text>
        <Text style={[styles.infoLabel, { color: mutedColor }]}>Photos</Text>
      </View>

      <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
        <Ionicons name="star-outline" size={24} color={primary} />
        <Text style={[styles.infoNumber, { color: textColor }]}>
          {amenities}
        </Text>
        <Text style={[styles.infoLabel, { color: mutedColor }]}>Amenities</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoGrid: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  infoCard: {
    flex: 1,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    alignItems: "center",
  },
  infoNumber: {
    fontSize: Typography.fontSize.h1,
    fontFamily: "PoppinsBold",
    marginTop: Spacing.xxxs,
  },
  infoLabel: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
  },
});
