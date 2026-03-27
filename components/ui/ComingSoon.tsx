import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: string;
}

export default function ComingSoon({
  title,
  description,
  icon = "🚧",
}: ComingSoonProps) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.content}>
        <View
          style={[styles.iconContainer, { backgroundColor: `${primary}15` }]}
        >
          <Text style={styles.iconText}>{icon}</Text>
        </View>

        <Text style={[styles.title, { color: textColor }]}>{title}</Text>

        <Text style={[styles.description, { color: muted }]}>
          {description}
        </Text>

        <View style={[styles.badge, { backgroundColor: `${primary}20` }]}>
          <Text style={[styles.badgeText, { color: primary }]}>
            Coming Soon
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: "PoppinsSemibold",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  badge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: "PoppinsSemibold",
  },
});
