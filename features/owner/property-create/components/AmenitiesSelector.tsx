import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AmenityCard from "@/components/ui/AmenityCard";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface AmenitiesSelectorProps {
  amenities: Array<{
    id: string;
    label: string;
    icon: string;
    value: string;
  }>;
  selectedAmenities: string[];
  toggleAmenity: (id: string) => void;
}

export default function AmenitiesSelector({
  amenities,
  selectedAmenities,
  toggleAmenity,
}: AmenitiesSelectorProps) {
  const primary = useThemeColor({}, "primary");

  return (
    <>
      <View style={styles.amenitiesGrid}>
        {amenities.map((amenity) => (
          <AmenityCard
            key={amenity.id}
            label={amenity.label}
            icon={amenity.icon as any}
            selected={selectedAmenities.includes(amenity.id)}
            onPress={() => toggleAmenity(amenity.id)}
          />
        ))}
      </View>

      <View
        style={[
          styles.selectedCountCard,
          { backgroundColor: `${primary}15` },
        ]}
      >
        <Ionicons name="checkmark-done" size={20} color={primary} />
        <Text style={[styles.selectedCountText, { color: primary }]}>
          {selectedAmenities.length}{" "}
          {selectedAmenities.length === 1 ? "amenity" : "amenities"}{" "}
          selected
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  selectedCountCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xs,
    borderRadius: Radius.sm,
    marginTop: Spacing.sm,
    gap: Spacing.xxs,
  },
  selectedCountText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
  },
});
