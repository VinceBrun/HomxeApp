import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PropertyListItem } from "@/types";

interface PropertyInfoProps {
  property: PropertyListItem;
}

export default function PropertyInfo({ property }: PropertyInfoProps) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = "#2D5F3F";

  return (
    <>
      {/* Title and Type */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {property.name}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: `${primary}15` }]}>
          <Text style={[styles.typeText, { color: primary }]}>
            {property.type}
          </Text>
        </View>
      </View>

      {/* Address */}
      <Text style={[styles.address, { color: mutedColor }]} numberOfLines={1}>
        {property.address}
      </Text>

      {/* Price */}
      <Text style={[styles.price, { color: textColor }]}>
        ₦{property.price.toLocaleString()}/month
      </Text>

      {/* Specs Row */}
      <View style={styles.specsRow}>
        <View style={styles.spec}>
          <Ionicons name="bed-outline" size={16} color={mutedColor} />
          <Text style={[styles.specText, { color: mutedColor }]}>
            {property.bedrooms}
          </Text>
        </View>
        <View style={styles.spec}>
          <Ionicons name="water-outline" size={16} color={mutedColor} />
          <Text style={[styles.specText, { color: mutedColor }]}>
            {property.bathrooms}
          </Text>
        </View>
        <View style={styles.spec}>
          <Ionicons name="expand-outline" size={16} color={mutedColor} />
          <Text style={[styles.specText, { color: mutedColor }]}>
            {property.size}m²
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "PoppinsSemibold",
    flex: 1,
    marginRight: Spacing.xs,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontFamily: "PoppinsSemibold",
  },
  address: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    marginBottom: 6,
  },
  price: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.sm,
  },
  specsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  spec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specText: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
  },
});
