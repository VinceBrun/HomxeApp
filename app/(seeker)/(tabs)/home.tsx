import { useRouter } from "expo-router";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useHomeData } from "@/features/seeker/home/hooks/useHomeData";
import { useThemeColor } from "@/hooks/useThemeColor";

import Web3Teaser from "@/components/ui/Web3Teaser";
import FeaturedProperties from "@/features/seeker/home/components/FeaturedProperties";
import FilterFab from "@/features/seeker/home/components/FilterFab";
import HomeHeader from "@/features/seeker/home/components/HomeHeader";
import NearbyProperties from "@/features/seeker/home/components/NearbyProperties";
import PopularProperties from "@/features/seeker/home/components/PopularProperties";

export default function SeekerHome() {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const primary = useThemeColor({}, "primary");

  const {
    userName,
    locationText,
    selectedType,
    setSelectedType,
    featuredProperties,
    nearbyProperties,
    popularProperties,
    loading,
    refreshing,
    onRefresh,
  } = useHomeData();

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handlePropertyPress = (id: string) => {
    router.push(`/(seeker)/property/${id}`);
  };

  const handleBookingsPress = () => {
    router.push("/(seeker)/(screens)/bookings");
  };

  const handleNotificationsPress = () => {
    console.log("Opening notifications");
  };

  const handleFilterPress = () => {
    console.log("Opening filter modal");
  };

  const handleSeeMore = () => {
    router.push("/(seeker)/explore");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: background }]}
      edges={["top"]}
    >
      <HomeHeader
        userName={userName}
        locationText={locationText}
        selectedType={selectedType}
        onTypeSelect={setSelectedType}
        onSearch={handleSearch}
        onBookingsPress={handleBookingsPress}
        onNotificationsPress={handleNotificationsPress}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primary}
          />
        }
      >
        {/* Featured: Filtered by selectedType */}
        <FeaturedProperties
          properties={featuredProperties}
          loading={loading}
          selectedType={selectedType}
          onPropertyPress={handlePropertyPress}
        />

        {/* Near You: NOT filtered, shows all types by distance */}
        <NearbyProperties
          properties={nearbyProperties}
          onPropertyPress={handlePropertyPress}
          onSeeMore={handleSeeMore}
        />

        <Web3Teaser />

        {/* Popular: NOT filtered, shows all types by date/views */}
        <PopularProperties
          properties={popularProperties}
          onPropertyPress={handlePropertyPress}
          onSeeMore={handleSeeMore}
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <FilterFab onPress={handleFilterPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
});
