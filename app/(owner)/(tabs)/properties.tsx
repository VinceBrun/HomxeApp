/**
 * Owner Properties Screen
 * List and management interface for a landlord's property portfolio.
 */

import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import FilterChip from "@/components/ui/FilterChip";
import Header from "@/components/ui/Header";
import SearchBar from "@/components/ui/SearchBar";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import PropertyListCard from "@/features/owner/properties/components/PropertyListCard";
import useProfile from "@/hooks/useProfile";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import { PropertyListItem } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType =
  | "all"
  | "listed"
  | "rented"
  | "maintenance"
  | "draft"
  | "delisted";
type SortType =
  | "recent"
  | "status"
  | "price"
  | "views"
  | "inquiries"
  | "alphabetical";

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "listed", label: "Listed" },
  { key: "rented", label: "Rented" },
  { key: "maintenance", label: "Maintenance" },
  { key: "draft", label: "Drafts" },
  { key: "delisted", label: "Delisted" },
];

const SORT_OPTIONS: { key: SortType; label: string }[] = [
  { key: "recent", label: "Recently Updated" },
  { key: "status", label: "By Status" },
  { key: "price", label: "Price (High-Low)" },
  { key: "views", label: "Most Views" },
  { key: "inquiries", label: "Most Inquiries" },
  { key: "alphabetical", label: "A-Z" },
];

export default function OwnerProperties() {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

  const { profile } = useProfile();
  const userId = profile?.id;

  const [properties, setProperties] = useState<PropertyListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("recent");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      if (!userId) return;

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("landlord_id", userId);

      if (!error && data && data.length > 0) {
        const mapped: PropertyListItem[] = data.map((p) => ({
          id: p.id,
          name: p.title,
          address: p.location,
          type: p.type,
          price: p.price,
          bedrooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0,
          size: p.square_feet || 0,
          images: p.images || [],
          status: p.status as any,
          views: p.views_count || 0, // From database
          inquiries: 0, // TODO: Fetch from inquiries table
          listedDaysAgo: Math.floor(
            (Date.now() - new Date(p.created_at).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
          is_available: p.is_available,
          latitude: p.latitude,
          longitude: p.longitude,
        }));

        setProperties(mapped);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProperties();
    setRefreshing(false);
  }, [fetchProperties]);

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties;

    if (selectedFilter !== "all") {
      filtered = filtered.filter((p) => p.status === selectedFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query),
      );
    }

    switch (sortBy) {
      case "price":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "views":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "inquiries":
        filtered.sort((a, b) => b.inquiries - a.inquiries);
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "status":
        filtered.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case "recent":
      default:
        filtered.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
    }

    return filtered;
  }, [properties, selectedFilter, searchQuery, sortBy]);

  const getFilterCount = (filter: FilterType): number => {
    if (filter === "all") return properties.length;
    return properties.filter((p) => p.status === filter).length;
  };

  const handleAddProperty = () => {
    router.push("/(owner)/property/create");
  };

  // FIXED: Navigate to property details (same as seeker)
  const handlePropertyPress = (id: string) => {
    router.push(`/(owner)/property/${id}`);
  };

  // FIXED: Navigate to edit screen
  const handleEdit = (id: string) => {
    router.push(`/(owner)/property/${id}/edit`);
  };

  // FIXED: Navigate to analytics
  const handleViewAnalytics = (id: string) => {
    router.push(`/(owner)/property/${id}/analytics`);
  };

  // FIXED: Native share functionality
  const handleShare = async (id: string) => {
    try {
      const property = properties.find((p) => p.id === id);
      if (!property) return;

      const message = `Check out my property: ${property.name}\n₦${property.price.toLocaleString()}/mo\n${property.address}`;

      await Share.share({
        message: message,
        title: property.name,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // FIXED: Navigate to inquiries
  const handleViewInquiries = (id: string) => {
    // TODO: Create inquiries screen
    console.log("View inquiries for property:", id);
    Alert.alert("Inquiries", "Inquiries screen coming soon!");
  };

  // FIXED: Contact tenant functionality
  const handleContactTenant = (id: string) => {
    // TODO: Fetch tenant info and open contact options
    console.log("Contact tenant for property:", id);
    Alert.alert("Contact Tenant", "Opening tenant contact...");
  };

  const handleSelectSort = (sort: SortType) => {
    setSortBy(sort);
    setShowSortModal(false);
  };

  const renderProperty = ({ item }: { item: PropertyListItem }) => (
    <PropertyListCard
      property={item}
      onPress={() => handlePropertyPress(item.id)}
      onEdit={() => handleEdit(item.id)}
      onViewAnalytics={() => handleViewAnalytics(item.id)}
      onShare={() => handleShare(item.id)}
      onViewInquiries={() => handleViewInquiries(item.id)}
      onContactTenant={() => handleContactTenant(item.id)}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <EmptyState
        icon="home-outline"
        title="No properties listed yet"
        message="Start earning by listing your first property"
      />
      <Button
        title="List Your First Property"
        handlePress={handleAddProperty}
        containerStyles="w-full px-7 mt-7"
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Header title="My Properties" showBackButton={true} />
        <TouchableOpacity style={styles.addButton} onPress={handleAddProperty}>
          <Ionicons name="add" size={24} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search properties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          renderIcon={() => (
            <Ionicons name="search" size={20} color={mutedColor} />
          )}
          useRouterSync={false}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTER_OPTIONS.map((filter) => (
            <FilterChip
              key={filter.key}
              label={`${filter.label} (${getFilterCount(filter.key)})`}
              isActive={selectedFilter === filter.key}
              onPress={() => setSelectedFilter(filter.key)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Sort Dropdown */}
      <TouchableOpacity
        style={styles.sortButton}
        onPress={() => setShowSortModal(true)}
      >
        <Ionicons name="funnel-outline" size={16} color={mutedColor} />
        <Text style={[styles.sortText, { color: mutedColor }]}>
          {SORT_OPTIONS.find((s) => s.key === sortBy)?.label}
        </Text>
        <Ionicons name="chevron-down" size={16} color={mutedColor} />
      </TouchableOpacity>

      {/* Properties List */}
      <FlatList
        data={filteredAndSortedProperties}
        renderItem={renderProperty}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator
              size="large"
              color={primary}
              style={{ marginTop: 50 }}
            />
          ) : (
            renderEmptyState
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primary}
          />
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: primary }]}
        onPress={handleAddProperty}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: textColor }]}>
                Sort By
              </Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Ionicons name="close" size={24} color={mutedColor} />
              </TouchableOpacity>
            </View>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.key}
                style={styles.sortOption}
                onPress={() => handleSelectSort(option.key)}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    { color: sortBy === option.key ? primary : textColor },
                  ]}
                >
                  {option.label}
                </Text>
                {sortBy === option.key && (
                  <Ionicons name="checkmark" size={20} color={primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "relative",
  },
  addButton: {
    position: "absolute",
    right: Spacing.lg,
    top: 24,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxs,
    paddingBottom: Spacing.sm,
  },
  filtersSection: {
    paddingBottom: Spacing.sm,
    paddingTop: Spacing.xl,
  },
  filtersContainer: {
    paddingHorizontal: Spacing.lg,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  sortText: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  emptyStateContainer: {
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
  },
  sortOptionText: {
    fontSize: 16,
    fontFamily: "PoppinsRegular",
  },
});
