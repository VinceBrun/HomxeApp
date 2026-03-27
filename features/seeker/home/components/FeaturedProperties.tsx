import PropertyCard from "@/components/ui/cards/PropertyCard";
import EmptyState from "@/components/ui/EmptyState";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Property } from "@/types";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { EMPTY_MESSAGES } from "../constants";

interface FeaturedPropertiesProps {
  properties: Property[];
  loading: boolean;
  selectedType: string;
  onPropertyPress: (id: string) => void;
}

export default function FeaturedProperties({
  properties,
  loading,
  selectedType,
  onPropertyPress,
}: FeaturedPropertiesProps) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Featured Properties
          </Text>
        </View>
        <Text style={[styles.loadingText, { color: mutedColor }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Featured Properties
        </Text>
      </View>

      {properties.length > 0 ? (
        <FlatList
          data={properties}
          renderItem={({ item }) => (
            <PropertyCard
              property={{
                id: item.id,
                image: item.images?.[0] || null,
                name: item.title,
                location: item.location,
                price: item.price,
                bedrooms: item.bedrooms,
                bathrooms: item.bathrooms,
              }}
              variant="compact"
              onPress={() => onPropertyPress(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      ) : (
        <EmptyState
          icon="home-outline"
          title={
            EMPTY_MESSAGES[selectedType as keyof typeof EMPTY_MESSAGES]
              ?.featured || "No featured properties"
          }
          message={`Try checking back later or explore other property types`}
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
  loadingText: {
    textAlign: "center",
    padding: Spacing.lg,
  },
  horizontalList: {
    paddingLeft: Spacing.lg,
    paddingRight: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
});
