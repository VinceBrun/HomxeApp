import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import UrgencyBadge from "./UrgencyBadge";

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  payment: number;
  urgency: "low" | "medium" | "high";
  status?: "available" | "active" | "completed";
  propertyName?: string;
  dueDate?: string;
  distance?: number;
}

interface JobCardProps {
  job: Job;
  onPress: (jobId: string) => void;
  variant?: "default" | "active";
}

export default function JobCard({
  job,
  onPress,
  variant = "default",
}: JobCardProps) {
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const brandGold = "#CBAA58";

  const isActive = variant === "active";

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: cardBg }]}
      onPress={() => onPress(job.id)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {job.title}
          </Text>
          <UrgencyBadge urgency={job.urgency} />
        </View>
        {job.propertyName && (
          <Text style={[styles.propertyName, { color: mutedColor }]}>
            {job.propertyName}
          </Text>
        )}
      </View>

      <Text
        style={[styles.description, { color: mutedColor }]}
        numberOfLines={2}
      >
        {job.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.location}>
          <Ionicons name="location-outline" size={16} color={mutedColor} />
          <Text
            style={[styles.locationText, { color: mutedColor }]}
            numberOfLines={1}
          >
            {job.distance !== undefined
              ? `${job.distance.toFixed(1)}km away`
              : job.location}
          </Text>
        </View>
        <View style={styles.payment}>
          <Ionicons name="cash-outline" size={16} color={brandGold} />
          <Text style={[styles.paymentText, { color: brandGold }]}>
            ₦{job.payment.toLocaleString()}
          </Text>
        </View>
      </View>

      {job.dueDate && (
        <View style={styles.dueDate}>
          <Ionicons
            name={isActive ? "time-outline" : "calendar-outline"}
            size={14}
            color={mutedColor}
          />
          <Text style={[styles.dueDateText, { color: mutedColor }]}>
            {job.dueDate}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "PoppinsSemibold",
    flex: 1,
    marginRight: Spacing.sm,
  },
  propertyName: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
  },
  description: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    marginRight: Spacing.sm,
  },
  locationText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
  payment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  paymentText: {
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
  },
  dueDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: Spacing.xs,
  },
  dueDateText: {
    fontSize: 11,
    fontFamily: "PoppinsRegular",
  },
});
