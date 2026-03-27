/**
 * Owner Dashboard
 * Central hub for landlords to monitor revenue, activity, and property performance.
 */

import { useRouter } from "expo-router";
import React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useDashboardData } from "@/features/owner/dashboard/hooks/useDashboardData";
import { useThemeColor } from "@/hooks/useThemeColor";

import DashboardRevenueChart from "@/features/owner/dashboard/components/DashboardCharts";
import DashboardHeader from "@/features/owner/dashboard/components/DashboardHeader";
import DashboardFloatingActions from "@/features/owner/dashboard/components/FloatingActions";
import DashboardNearbyProperties from "@/features/owner/dashboard/components/NearbyProperties";
import DashboardPropertyOverview from "@/features/owner/dashboard/components/PropertyOverview";
import DashboardRecentActivity from "@/features/owner/dashboard/components/RecentActivity";
import DashboardStatsGrid from "@/features/owner/dashboard/components/StatsGrid";
import DashboardUpcomingEvents from "@/features/owner/dashboard/components/UpcomingEvents";

export default function OwnerDashboard() {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const primary = useThemeColor({}, "primary");

  const {
    locationText,
    stats,
    activities,
    nearbyProperties,
    upcomingEvents,
    refreshing,
    onRefresh,
    ownerName,
  } = useDashboardData();

  const handleNotifications = () => {
    console.log("Open notifications");
  };

  const handleManageProperties = () => {
    router.push("/(owner)/(tabs)/properties");
  };

  const handleViewAllActivity = () => {
    console.log("View all activity");
  };

  const handleListProperty = () => {
    router.push("/(owner)/property/create");
  };

  const handlePropertyPress = (propertyId: string) => {
    console.log("Property pressed:", propertyId);
  };

  const handleActivityPress = (activityId: string) => {
    console.log("Activity pressed:", activityId);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: background }]}
      edges={["top"]}
    >
      <DashboardHeader
        ownerName={ownerName}
        locationText={locationText}
        onNotifications={handleNotifications}
        onManageProperties={handleManageProperties}
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
        contentContainerStyle={styles.scrollContent}
      >
        <DashboardStatsGrid stats={stats} />

        <DashboardRevenueChart />

        <DashboardPropertyOverview stats={stats} />

        <DashboardNearbyProperties
          properties={nearbyProperties}
          onPropertyPress={handlePropertyPress}
        />

        <DashboardRecentActivity
          activities={activities}
          onViewAll={handleViewAllActivity}
          onActivityPress={handleActivityPress}
        />

        <DashboardUpcomingEvents events={upcomingEvents} />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <DashboardFloatingActions onAddProperty={handleListProperty} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  bottomSpacer: {
    height: 10,
  },
});
