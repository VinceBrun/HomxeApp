import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import StatCard from "@/components/ui/StatCard";
import Spacing from "@/constants/SPACING";
import { DashboardStats } from "../types/dashboard.types";

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export default function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  const router = useRouter();
  const brandGold = "#CBAA58";

  return (
    <View style={styles.statsGrid}>
      <View style={styles.statCardWrapper}>
        <StatCard
          icon="home-outline"
          label="Properties"
          value={stats.totalProperties}
          onPress={() => router.push("/(owner)/(tabs)/properties")}
        />
      </View>
      <View style={styles.statCardWrapper}>
        <StatCard
          icon="chatbubbles-outline"
          label="Inquiries"
          value={stats.activeInquiries}
          onPress={() => router.push("/(owner)/(tabs)/chat")}
          iconColor={brandGold}
        />
      </View>
      <View style={styles.statCardWrapper}>
        <StatCard
          icon="cash-outline"
          label="This Month"
          value={`₦${(stats.monthlyEarnings / 1000).toFixed(0)}k`}
          trend={{ value: 12, isPositive: true }}
          onPress={() => {}} // Placeholder for earnings view
          iconColor={brandGold}
        />
      </View>
      <View style={styles.statCardWrapper}>
        <StatCard
          icon="construct-outline"
          label="Requests"
          value={stats.serviceRequests}
          onPress={() => router.push("/(owner)/(tabs)/services")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  statCardWrapper: {
    width: "47%",
  },
});
