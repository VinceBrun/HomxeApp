import FilterChip from "@/components/ui/FilterChip";
import SearchBar from "@/components/ui/SearchBar";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { PROPERTY_TYPES } from "../constants";

interface HomeHeaderProps {
  userName: string;
  locationText: string;
  selectedType: string;
  onTypeSelect: (type: string) => void;
  onSearch: (query: string) => void;
  onBookingsPress: () => void;
  onNotificationsPress: () => void;
}

export default function HomeHeader({
  userName,
  locationText,
  selectedType,
  onTypeSelect,
  onSearch,
  onBookingsPress,
  onNotificationsPress,
}: HomeHeaderProps) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={[styles.stickyHeader, { backgroundColor: background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: textColor }]}>
            Hi, {userName}
          </Text>
          <TouchableOpacity style={styles.locationContainer}>
            <Ionicons name="location" size={16} color={primary} />
            <Text
              style={[styles.locationText, { color: mutedColor }]}
              numberOfLines={1}
            >
              {locationText}
            </Text>
            <Ionicons name="chevron-down" size={16} color={mutedColor} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: cardBg }]}
            onPress={onBookingsPress}
          >
            <Ionicons name="calendar-outline" size={20} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: cardBg }]}
            onPress={onNotificationsPress}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={textColor}
            />
            <View
              style={[styles.notificationBadge, { backgroundColor: primary }]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar placeholder="Search properties..." onChangeText={onSearch} />
      </View>

      {/* Property Type Filters */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {PROPERTY_TYPES.map((type) => (
            <FilterChip
              key={type}
              label={type}
              isActive={selectedType === type}
              onPress={() => onTypeSelect(type)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyHeader: {
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontFamily: "PoppinsSemibold",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: "80%",
  },
  locationText: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  filtersSection: {
    paddingVertical: Spacing.xs,
  },
  filtersContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
});
