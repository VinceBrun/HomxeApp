import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import { useThemeColor } from "@/hooks/useThemeColor";

interface DashboardHeaderProps {
  ownerName: string;
  locationText: string;
  onNotifications: () => void;
  onManageProperties: () => void;
}

export default function DashboardHeader({
  ownerName,
  locationText,
  onNotifications,
  onManageProperties,
}: DashboardHeaderProps) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={[styles.greeting, { color: textColor }]}>
          Hi, {ownerName}
        </Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          {locationText}
        </Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: cardBg }]}
          onPress={onManageProperties}
        >
          <Ionicons name="business-outline" size={20} color={textColor} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: cardBg }]}
          onPress={onNotifications}
        >
          <Ionicons name="notifications-outline" size={20} color={textColor} />
          <View
            style={[styles.notificationBadge, { backgroundColor: primary }]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
