import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PropertyListItem } from "@/types";

interface PropertyMetricsProps {
  property: PropertyListItem;
}

export default function PropertyMetrics({ property }: PropertyMetricsProps) {
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View style={styles.metricsRow}>
      <View style={styles.metric}>
        <Ionicons name="eye-outline" size={14} color={mutedColor} />
        <Text style={[styles.metricText, { color: mutedColor }]}>
          {property.views}
        </Text>
      </View>
      <View style={styles.metric}>
        <Ionicons name="chatbubble-outline" size={14} color={mutedColor} />
        <Text style={[styles.metricText, { color: mutedColor }]}>
          {property.inquiries}
        </Text>
      </View>
      <View style={styles.metric}>
        <Ionicons name="calendar-outline" size={14} color={mutedColor} />
        <Text style={[styles.metricText, { color: mutedColor }]}>
          {property.listedDaysAgo}d
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metric: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
  },
});
