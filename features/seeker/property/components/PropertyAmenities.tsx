import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PropertyAmenitiesProps {
  facilities: Record<string, boolean>;
}

export default function PropertyAmenities({ facilities }: PropertyAmenitiesProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

  const amenityList = Object.entries(facilities || {}).filter(
    ([_, value]) => value === true,
  );

  if (amenityList.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Amenities
      </Text>

      <View style={styles.amenitiesGrid}>
        {amenityList.map(([key, _]) => {
          const amenityIcons: { [key: string]: string } = {
            parking: "car",
            wifi: "wifi",
            ac: "snow",
            security: "shield-checkmark",
            generator: "flash",
            pool: "water",
            gym: "barbell",
            garden: "leaf",
            balcony: "home",
            furnished: "bed",
            pets: "paw",
            kitchen: "restaurant",
            laundry: "shirt",
            elevator: "arrow-up",
            storage: "cube",
            heater: "flame",
            playground: "football",
            fireplace: "bonfire",
          };

          const icon = amenityIcons[key] || "checkmark-circle";
          const label =
            key.charAt(0).toUpperCase() +
            key.slice(1).replace(/_/g, " ");

          return (
            <View
              key={key}
              style={[styles.amenityItem, { backgroundColor: cardBg }]}
            >
              <Ionicons name={icon as any} size={20} color={primary} />
              <Text style={[styles.amenityLabel, { color: textColor }]}>
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.sm,
  },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  amenityItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
    padding: Spacing.xs,
    borderRadius: Radius.sm,
  },
  amenityLabel: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
});
