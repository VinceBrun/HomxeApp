import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface AmenityCardProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}

export default function AmenityCard({
  label,
  icon,
  selected,
  onPress,
}: AmenityCardProps) {
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = "#2D5F3F";
  const borderColor = selected ? primary : "rgba(0,0,0,0.08)";

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: selected ? `${primary}10` : cardBg,
          borderColor,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={20}
        color={selected ? primary : mutedColor}
        style={styles.icon}
      />
      <Text
        style={[styles.label, { color: selected ? primary : textColor }]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "31%", // 3 columns
    paddingVertical: Spacing.sm + 2, // 10px
    paddingHorizontal: Spacing.xs, // 4px
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
    marginBottom: Spacing.sm,
  },
  icon: {
    marginBottom: Spacing.xs - 2, // 2px
  },
  label: {
    fontSize: 10,
    fontFamily: "PoppinsMedium",
    textAlign: "center",
  },
});
