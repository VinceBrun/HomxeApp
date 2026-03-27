import Radius from "@/constants/RADIUS";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type UrgencyLevel = "low" | "medium" | "high";

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  size?: "small" | "medium";
}

const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#10B981",
};

export default function UrgencyBadge({
  urgency,
  size = "small",
}: UrgencyBadgeProps) {
  const color = URGENCY_COLORS[urgency];
  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: `${color}15` },
        isSmall ? styles.small : styles.medium,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color },
          isSmall ? styles.textSmall : styles.textMedium,
        ]}
      >
        {urgency.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  small: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  medium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontFamily: "PoppinsSemibold",
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 12,
  },
});
