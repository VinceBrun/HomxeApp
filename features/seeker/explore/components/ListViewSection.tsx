import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropertyCard from "@/components/ui/cards/PropertyCard";
import { ExploreProperty } from "../types/explore.types";
import { useThemeColor } from "@/hooks/useThemeColor";
import Spacing from "@/constants/SPACING";

interface ListViewSectionProps {
  properties: ExploreProperty[];
  sortBy: string;
  onSort: () => void;
  onPropertyPress: (id: string) => void;
  onFavorite: (id: string) => void;
}

export default function ListViewSection({
  properties,
  sortBy,
  onSort,
  onPropertyPress,
  onFavorite,
}: ListViewSectionProps) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <ScrollView
      style={styles.listContainer}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.listHeader}>
        <Text style={[styles.resultsTextList, { color: textColor }]}>
          {properties.length} properties found
        </Text>
        <TouchableOpacity style={styles.sortButtonList} onPress={onSort}>
          <Text style={[styles.sortTextList, { color: mutedColor }]}>
            Sort by: {sortBy}
          </Text>
          <Ionicons name="chevron-down" size={16} color={mutedColor} />
        </TouchableOpacity>
      </View>

      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onPress={() => onPropertyPress(property.id)}
          onFavorite={() => onFavorite(property.id)}
          isFavorited={property.isFavorite}
          variant="list"
          style={{ marginBottom: Spacing.md }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listContainer: { flex: 1 },
  listContent: {
    padding: Spacing.md,
    paddingBottom: 100,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  resultsTextList: {
    fontSize: 16,
    fontFamily: "PoppinsSemibold",
  },
  sortButtonList: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortTextList: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
  },
});
