import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "@/components/ui/SearchBar";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ViewMode } from "../types/explore.types";

interface ExploreHeaderProps {
  onBack: () => void;
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onFilterPress: () => void;
}

export default function ExploreHeader({
  onBack,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onFilterPress,
}: ExploreHeaderProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: textColor }]}>Explore</Text>

        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchRow}>
        <SearchBar
          placeholder="Search for Apartment"
          value={searchQuery}
          onChangeText={setSearchQuery}
          renderIcon={() => (
            <Ionicons name="search" size={20} color={mutedColor} />
          )}
          useRouterSync={false}
        />

        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: cardBg }]}
          onPress={onFilterPress}
        >
          <Ionicons name="options-outline" size={24} color={primary} />
        </TouchableOpacity>

        {viewMode === "list" && (
          <TouchableOpacity
            style={[styles.filterButton, { backgroundColor: cardBg }]}
            onPress={() => setViewMode("map")}
          >
            <Ionicons name="map-outline" size={24} color={textColor} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "PoppinsSemibold",
  },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
    alignItems: "center",
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
});
