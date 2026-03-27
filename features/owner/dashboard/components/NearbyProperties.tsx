import React from "react";
import { View, Text, StyleSheet } from "react-native";
import NearbyPropertyCard from "./NearbyPropertyCard";
import EmptyState from "@/components/ui/EmptyState";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { NearbyProperty } from "../types/dashboard.types";

interface DashboardNearbyPropertiesProps {
  properties: NearbyProperty[];
  onPropertyPress: (id: string) => void;
}

export default function DashboardNearbyProperties({
  properties,
  onPropertyPress,
}: DashboardNearbyPropertiesProps) {
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Nearby Properties ({properties.length} within 5km)
      </Text>
      {properties.length > 0 ? (
        properties.map((property) => (
          <NearbyPropertyCard
            key={property.id}
            property={property}
            onPress={onPropertyPress}
          />
        ))
      ) : (
        <EmptyState
          icon="location-outline"
          title="No nearby properties"
          message="Properties you manage will appear here"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
    marginBottom: Spacing.md,
  },
});
