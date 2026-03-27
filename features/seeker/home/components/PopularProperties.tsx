import PropertyCard from "@/components/ui/cards/PropertyCard";
import EmptyState from "@/components/ui/EmptyState";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Property } from "@/types";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PopularPropertiesProps {
  properties: Property[];
  onPropertyPress: (id: string) => void;
  onSeeMore: () => void;
}

export default function PopularProperties({
  properties,
  onPropertyPress,
  onSeeMore,
}: PopularPropertiesProps) {
  const textColor = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Popular This Week
        </Text>
        <TouchableOpacity onPress={onSeeMore}>
          <Text style={[styles.seeMore, { color: primary }]}>See more</Text>
        </TouchableOpacity>
      </View>

      {properties.length > 0 ? (
        properties.slice(0, 5).map((property) => (
          <PropertyCard
            key={property.id}
            property={{
              id: property.id,
              image: property.images?.[0] || null,
              name: property.title, // ✅ FIXED: Use title for name
              title: property.title, // ✅ FIXED: Also provide title
              address: property.location,
              location: property.location,
              price: property.price, // ✅ FIXED: Pass number, card formats it
              bedrooms: property.bedrooms || 0,
              bathrooms: property.bathrooms || 0,
            }}
            variant="list"
            onPress={() => onPropertyPress(property.id)}
            style={{ marginHorizontal: Spacing.lg }}
          />
        ))
      ) : (
        <EmptyState
          icon="trending-up-outline"
          title="No Popular Properties"
          message="Check back soon for trending properties from this week"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
  },
  seeMore: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
  },
});
