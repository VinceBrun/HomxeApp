import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

interface FilterFabProps {
  onPress: () => void;
}

export default function FilterFab({ onPress }: FilterFabProps) {
  const primary = useThemeColor({}, "primary");

  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: primary }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="options-outline" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
