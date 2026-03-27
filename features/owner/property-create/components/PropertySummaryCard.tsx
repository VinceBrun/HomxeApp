import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PropertySummaryCardProps {
  propertyData: {
    type: string;
    name: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    size: string;
    monthlyRent: string;
  };
}

export default function PropertySummaryCard({
  propertyData,
}: PropertySummaryCardProps) {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View style={[styles.summaryCard, { backgroundColor: cardBg }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: textColor }]}>
          {propertyData.name}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/(owner)/property/create/step1")}
        >
          <Ionicons name="create-outline" size={20} color={primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.propertyDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="home-outline" size={16} color={mutedColor} />
          <Text style={[styles.detailText, { color: mutedColor }]}>
            {propertyData.type}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={mutedColor} />
          <Text style={[styles.detailText, { color: mutedColor }]}>
            {propertyData.address}
          </Text>
        </View>

        <View style={styles.specsRow}>
          <View style={styles.specBadge}>
            <Ionicons name="bed-outline" size={14} color={primary} />
            <Text style={[styles.specText, { color: textColor }]}>
              {propertyData.bedrooms} bed
            </Text>
          </View>

          <View style={styles.specBadge}>
            <Ionicons name="water-outline" size={14} color={primary} />
            <Text style={[styles.specText, { color: textColor }]}>
              {propertyData.bathrooms} bath
            </Text>
          </View>

          <View style={styles.specBadge}>
            <Ionicons name="expand-outline" size={14} color={primary} />
            <Text style={[styles.specText, { color: textColor }]}>
              {propertyData.size}m²
            </Text>
          </View>
        </View>

        <View style={[styles.priceRow, { backgroundColor: `${tertiary}15` }]}>
          <Text style={[styles.priceLabel, { color: mutedColor }]}>
            Monthly Rent
          </Text>
          <Text style={[styles.priceValue, { color: tertiary }]}>
            ₦{propertyData.monthlyRent}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
    flex: 1,
  },
  propertyDetails: {
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  detailText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
  specsRow: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginTop: Spacing.xxs,
  },
  specBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxxs,
  },
  specText: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsMedium",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Spacing.xs,
    borderRadius: Radius.sm,
    marginTop: Spacing.xs,
  },
  priceLabel: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
  },
  priceValue: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
  },
});
