import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
}

export default function EmptyState({ icon, title, message }: EmptyStateProps) {
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${primary}15` }]}>
        <Ionicons name={icon} size={48} color={primary} />
      </View>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.message, { color: mutedColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    padding: Spacing.xl,
    borderRadius: Radius.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    lineHeight: 20,
  },
});
