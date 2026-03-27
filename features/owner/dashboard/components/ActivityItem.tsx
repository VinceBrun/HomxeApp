import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ActivityType =
  | "inquiry"
  | "inspection"
  | "payment"
  | "maintenance"
  | "review";

interface ActivityItemProps {
  type: ActivityType;
  title: string;
  description: string;
  timeAgo: string;
  onPress?: () => void;
}

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  inquiry: { icon: "chatbubble-outline", color: "#3B82F6" },
  inspection: { icon: "calendar-outline", color: "#8B5CF6" },
  payment: { icon: "card-outline", color: "#CBAA58" },
  maintenance: { icon: "construct-outline", color: "#F59E0B" },
  review: { icon: "star-outline", color: "#EF4444" },
};

export default function ActivityItem({
  type,
  title,
  description,
  timeAgo,
  onPress,
}: ActivityItemProps) {
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  const config = ACTIVITY_CONFIG[type];
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, { backgroundColor: cardBg }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: `${config.color}15` }]}
      >
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        <Text
          style={[styles.description, { color: mutedColor }]}
          numberOfLines={2}
        >
          {description}
        </Text>
        <Text style={[styles.timeAgo, { color: mutedColor }]}>{timeAgo}</Text>
      </View>

      {onPress && (
        <Ionicons name="chevron-forward" size={20} color={mutedColor} />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    lineHeight: 18,
    marginBottom: 2,
  },
  timeAgo: {
    fontSize: 11,
    fontFamily: "PoppinsRegular",
  },
});
