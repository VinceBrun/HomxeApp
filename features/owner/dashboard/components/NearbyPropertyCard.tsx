import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface NearbyProperty {
  id: string;
  name: string;
  location: string;
  distance: number;
  status: "rented" | "vacant" | "maintenance";
}

interface NearbyPropertyCardProps {
  property: NearbyProperty;
  onPress: (propertyId: string) => void;
}

export default function NearbyPropertyCard({
  property,
  onPress,
}: NearbyPropertyCardProps) {
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");
  const brandGold = "#CBAA58";

  const getStatusColor = () => {
    switch (property.status) {
      case "rented":
        return primary;
      case "vacant":
        return brandGold;
      case "maintenance":
        return "#EF4444";
      default:
        return mutedColor;
    }
  };

  const getStatusText = () => {
    switch (property.status) {
      case "rented":
        return "Occupied";
      case "vacant":
        return "Available";
      case "maintenance":
        return "Maintenance";
      default:
        return "Unknown";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: cardBg }]}
      onPress={() => onPress(property.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {property.name}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${getStatusColor()}15` },
          ]}
        >
          <View
            style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
          />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.location}>
          <Ionicons name="location-outline" size={16} color={brandGold} />
          <Text style={[styles.locationText, { color: brandGold }]}>
            {property.distance.toFixed(1)}km away
          </Text>
        </View>
        <Text style={[styles.area, { color: mutedColor }]} numberOfLines={1}>
          {property.location}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 15,
    fontFamily: "PoppinsSemibold",
    flex: 1,
    marginRight: Spacing.sm,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.xs,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: "PoppinsSemibold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    fontFamily: "PoppinsSemibold",
  },
  area: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
});
