import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ActivityItem from "./ActivityItem";
import EmptyState from "@/components/ui/EmptyState";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Activity } from "../types/dashboard.types";

interface DashboardRecentActivityProps {
  activities: Activity[];
  onViewAll: () => void;
  onActivityPress: (id: string) => void;
}

export default function DashboardRecentActivity({
  activities,
  onViewAll,
  onActivityPress,
}: DashboardRecentActivityProps) {
  const textColor = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Recent Activity
        </Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={[styles.viewAll, { color: primary }]}>View All</Text>
        </TouchableOpacity>
      </View>
      {activities.length > 0 ? (
        activities
          .slice(0, 3)
          .map((activity) => (
            <ActivityItem
              key={activity.id}
              type={activity.type}
              title={activity.title}
              description={activity.description}
              timeAgo={activity.timeAgo}
              onPress={() => onActivityPress(activity.id)}
            />
          ))
      ) : (
        <EmptyState
          icon="pulse-outline"
          title="No recent activity"
          message="Your property activities will appear here"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: Spacing.md,
  },
  viewAll: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
  },
});
