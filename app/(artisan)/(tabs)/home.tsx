/**
 * Artisan Home Screen
 * Dashboard for vendors to view earnings, stats, and job opportunities.
 */

import EmptyState from "@/components/ui/EmptyState";
import StatCard from "@/components/ui/StatCard";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import JobCard, {
  Job,
} from "@/features/artisan/dashboard/components/ArtisanJobCard";
import { useLocation } from "@/hooks/useLocation";
import useProfile from "@/hooks/useProfile";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface VendorStats {
  availableJobs: number;
  totalEarnings: number;
  averageRating: number;
  completedJobs: number;
}

export default function VendorHome() {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const brandGold = "#CBAA58";

  const { profile } = useProfile();
  const location = useLocation();
  const vendorName = profile?.full_name?.split(" ")[0] || "Vendor";

  const [locationText, setLocationText] = useState("Getting location...");

  const [stats, setStats] = useState<VendorStats>({
    availableJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
    completedJobs: 0,
  });
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const earningsData = {
    labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        data: [45, 52, 48, 65, 70, 85],
        color: (_opacity = 1) => brandGold,
        strokeWidth: 3,
      },
    ],
  };

  const fetchVendorData = useCallback(async () => {
    try {
      const userLocation = await location.getCurrentLocationWithAddress();
      if (userLocation?.address) {
        const parts = userLocation.address.split(",");
        const city = parts[parts.length - 2]?.trim() || "Port Harcourt";
        const state = parts[parts.length - 1]?.trim() || "Rivers";
        setLocationText(`${city}, ${state}`);
      } else {
        setLocationText("Port Harcourt, Rivers");
      }

      setStats({
        availableJobs: 8,
        totalEarnings: 245000,
        averageRating: 4.7,
        completedJobs: 23,
      });

      const mockAvailableJobs: Job[] = [
        {
          id: "1",
          title: "Plumbing Repair",
          description: "Fix leaking pipes in kitchen",
          location: "Port Harcourt, Rivers",
          payment: 15000,
          urgency: "high",
          status: "available",
          propertyName: "Luxury Apartment",
          dueDate: "Today",
          distance: 2.3,
        },
        {
          id: "2",
          title: "Electrical Installation",
          description: "Install new lighting fixtures",
          location: "Rumuokoro, Port Harcourt",
          payment: 25000,
          urgency: "medium",
          status: "available",
          propertyName: "Garden Villa",
          dueDate: "Tomorrow",
          distance: 5.7,
        },
        {
          id: "3",
          title: "Deep Cleaning",
          description: "Full apartment deep cleaning",
          location: "GRA Phase 2",
          payment: 20000,
          urgency: "low",
          status: "available",
          propertyName: "Downtown Loft",
          dueDate: "Feb 5",
          distance: 8.2,
        },
      ];

      const mockActiveJobs: Job[] = [
        {
          id: "4",
          title: "AC Maintenance",
          description: "Service 3 AC units",
          location: "Eliozu, Port Harcourt",
          payment: 30000,
          urgency: "medium",
          status: "active",
          propertyName: "Seaside Residence",
          dueDate: "In Progress",
          distance: 3.1,
        },
        {
          id: "5",
          title: "Painting",
          description: "Repaint 2-bedroom apartment",
          location: "Trans Amadi",
          payment: 45000,
          urgency: "low",
          status: "active",
          propertyName: "City Heights",
          dueDate: "In Progress",
          distance: 6.4,
        },
      ];

      mockAvailableJobs.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      mockActiveJobs.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setAvailableJobs(mockAvailableJobs);
      setActiveJobs(mockActiveJobs);
    } catch (error) {
      console.error("Error fetching vendor data:", error);
      setLocationText("Port Harcourt, Rivers");
    }
  }, [location]);

  useEffect(() => {
    fetchVendorData();
  }, [fetchVendorData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchVendorData();
    setRefreshing(false);
  }, [fetchVendorData]);

  const handleJobPress = useCallback(
    (jobId: string) => {
      router.push(`/(artisan)/job/${jobId}`);
    },
    [router],
  );

  const handleBrowseJobs = useCallback(() => {
    router.push("/(artisan)/(tabs)/jobs");
  }, [router]);

  const handleNotifications = useCallback(() => {
    console.log("Open notifications");
  }, []);

  const handleViewEarnings = useCallback(() => {
    router.push("/(artisan)/(tabs)/earnings");
  }, [router]);

  const chartConfig = {
    backgroundGradientFrom: cardBg,
    backgroundGradientTo: cardBg,
    color: (_opacity = 1) => brandGold,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontFamily: "PoppinsRegular",
      fontSize: 11,
    },
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.greeting, { color: textColor }]}>
            Hi, {vendorName}
          </Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>
            {locationText}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: cardBg }]}
            onPress={handleBrowseJobs}
          >
            <Ionicons name="search-outline" size={20} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: cardBg }]}
            onPress={handleNotifications}
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
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCardWrapper}>
            <StatCard
              icon="briefcase-outline"
              label="Available"
              value={stats.availableJobs}
              onPress={handleBrowseJobs}
            />
          </View>
          <View style={styles.statCardWrapper}>
            <StatCard
              icon="cash-outline"
              label="Earnings"
              value={`₦${(stats.totalEarnings / 1000).toFixed(0)}k`}
              trend={{ value: 18, isPositive: true }}
              onPress={handleViewEarnings}
              iconColor={brandGold}
            />
          </View>
          <View style={styles.statCardWrapper}>
            <StatCard
              icon="star-outline"
              label="Rating"
              value={stats.averageRating.toFixed(1)}
              iconColor={brandGold}
            />
          </View>
          <View style={styles.statCardWrapper}>
            <StatCard
              icon="checkmark-circle-outline"
              label="Completed"
              value={stats.completedJobs}
            />
          </View>
        </View>

        {/* Earnings Chart */}
        <View style={[styles.chartCard, { backgroundColor: cardBg }]}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartTitle, { color: textColor }]}>
              Earnings Trend
            </Text>
            <TouchableOpacity onPress={handleViewEarnings}>
              <Text style={[styles.chartLink, { color: primary }]}>
                View Details
              </Text>
            </TouchableOpacity>
          </View>
          <LineChart
            data={earningsData}
            width={width - Spacing.lg * 2 - Spacing.md * 2}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots={true}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            formatYLabel={(value) => `₦${value}k`}
          />
          <Text style={[styles.chartSubtext, { color: mutedColor }]}>
            Last 6 months performance
          </Text>
        </View>

        {/* Available Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Jobs Near You ({availableJobs.length} within 10km)
            </Text>
            <TouchableOpacity onPress={handleBrowseJobs}>
              <Text style={[styles.viewAll, { color: primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {availableJobs.length > 0 ? (
            availableJobs.map((job) => (
              <JobCard key={job.id} job={job} onPress={handleJobPress} />
            ))
          ) : (
            <EmptyState
              icon="briefcase-outline"
              title="No jobs available"
              message="Check back later for new opportunities"
            />
          )}
        </View>

        {/* Active Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Active Jobs
            </Text>
            <TouchableOpacity>
              <Text style={[styles.viewAll, { color: primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          {activeJobs.length > 0 ? (
            activeJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onPress={handleJobPress}
                variant="active"
              />
            ))
          ) : (
            <EmptyState
              icon="time-outline"
              title="No active jobs"
              message="Accept a job to get started"
            />
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <View style={[styles.floatingActions, { backgroundColor: background }]}>
        <TouchableOpacity
          style={[styles.floatingButton, { backgroundColor: primary }]}
          onPress={handleBrowseJobs}
        >
          <Ionicons name="search" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontFamily: "PoppinsSemibold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
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
  scrollContent: {
    paddingBottom: 100,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  statCardWrapper: {
    width: "47%",
  },
  chartCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
  },
  chartLink: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
  },
  chart: {
    marginVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  chartSubtext: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
  },
  viewAll: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
  },
  bottomSpacer: {
    height: 10,
  },
  floatingActions: {
    position: "absolute",
    bottom: 24,
    right: 24,
  },
  floatingButton: {
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
});
