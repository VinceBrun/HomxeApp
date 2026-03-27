import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";

interface DashboardFloatingActionsProps {
  onAddProperty: () => void;
}

export default function DashboardFloatingActions({ onAddProperty }: DashboardFloatingActionsProps) {
  const background = useThemeColor({}, "background");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={[styles.floatingActions, { backgroundColor: background }]}>
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: primary }]}
        onPress={onAddProperty}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingActions: {
    position: "absolute",
    bottom: 24,
    right: 24,
    flexDirection: "row",
    gap: Spacing.sm,
  },
  floatingButton: {
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
