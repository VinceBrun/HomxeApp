/**
 * Seeker Explore Screen
 * Map-based and list-based property discovery with location tracking and filtering.
 */

import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { useExploreProperties } from "@/features/seeker/explore/hooks/useExploreProperties";
import { ViewMode } from "@/features/seeker/explore/types/explore.types";
import { useThemeColor } from "@/hooks/useThemeColor";

import Spacing from "@/constants/SPACING";
import ExploreHeader from "@/features/seeker/explore/components/ExploreHeader";
import ListViewSection from "@/features/seeker/explore/components/ListViewSection";
import MapViewSection from "@/features/seeker/explore/components/MapViewSection";

export default function ExploreScreen() {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const [viewMode, setViewMode] = useState<ViewMode>("map");

  const {
    mapRef,
    bottomSheetRef,
    properties,
    selectedProperty,
    searchQuery,
    setSearchQuery,
    sortBy,
    loading,
    userLocation,
    toggleFavorite,
    centerOnUserLocation,
    handleMarkerPress,
  } = useExploreProperties();

  const handleBack = () => {
    router.back();
  };

  const handlePropertyPress = (id: string) => {
    router.push(`/(seeker)/property/${id}`);
  };

  const handleFilterPress = () => {
    // Implement filter modal/screen
    console.log("Open filters");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: background }]}
      edges={["top"]}
    >
      <ExploreHeader
        onBack={handleBack}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onFilterPress={handleFilterPress}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primary} />
          <Text style={[styles.loadingText, { color: mutedColor }]}>
            Finding properties near you...
          </Text>
        </View>
      ) : viewMode === "map" ? (
        <MapViewSection
          mapRef={mapRef as React.RefObject<MapView>}
          bottomSheetRef={bottomSheetRef as React.RefObject<BottomSheet>}
          userLocation={userLocation}
          properties={properties}
          selectedProperty={selectedProperty}
          onMarkerPress={handleMarkerPress}
          onPropertyPress={handlePropertyPress}
          onFavorite={toggleFavorite}
          onCenterUser={centerOnUserLocation}
          onViewList={() => setViewMode("list")}
          onSort={() => {}} // Implement sort modal
        />
      ) : (
        <ListViewSection
          properties={properties}
          sortBy={sortBy}
          onSort={() => {}} // Implement sort modal
          onPropertyPress={handlePropertyPress}
          onFavorite={toggleFavorite}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
});
