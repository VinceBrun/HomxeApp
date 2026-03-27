import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
  iconColor?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  trend,
  onPress,
  iconColor,
}: StatCardProps) {
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const finalIconColor = iconColor || primary;

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, { backgroundColor: cardBg }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${finalIconColor}15` },
        ]}
      >
        <Ionicons name={icon} size={24} color={finalIconColor} />
      </View>

      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
      <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>

      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons
            name={trend.isPositive ? "trending-up" : "trending-down"}
            size={16}
            color={trend.isPositive ? "#10B981" : "#EF4444"}
          />
          <Text
            style={[
              styles.trendText,
              { color: trend.isPositive ? "#10B981" : "#EF4444" },
            ]}
          >
            {trend.value > 0 ? "+" : ""}
            {trend.value}%
          </Text>
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.md,
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: 24,
    fontFamily: "PoppinsSemibold",
    marginBottom: 2,
  },
  label: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: Spacing.xs,
  },
  trendText: {
    fontSize: 12,
    fontFamily: "PoppinsSemibold",
  },
});
