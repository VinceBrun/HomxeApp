// import Radius from "@/constants/RADIUS";
// import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export default function FilterChip({
  label,
  isActive,
  onPress,
}: FilterChipProps) {
  const primary = useThemeColor({}, "primary");
  const cardBg = useThemeColor({}, "card");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isActive ? primary : cardBg,
          borderColor: isActive ? primary : "#E5E7EB",
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          {
            color: isActive ? "#FFFFFF" : mutedColor,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
  },
});
