import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";

interface PropertyActionsProps {
  onEdit: () => void;
  onViewAnalytics: () => void;
  onShare: () => void;
  onMoreOptions: () => void;
  primaryColor: string;
}

export default function PropertyActions({
  onEdit,
  onViewAnalytics,
  onShare,
  onMoreOptions,
  primaryColor,
}: PropertyActionsProps) {
  return (
    <View style={styles.actionsRow}>
      <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
        <Ionicons name="pencil-outline" size={22} color={primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={onViewAnalytics}>
        <Ionicons name="stats-chart-outline" size={22} color={primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={onShare}>
        <Ionicons name="share-social-outline" size={22} color={primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={onMoreOptions}>
        <Ionicons name="ellipsis-horizontal" size={22} color={primaryColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E515",
  },
  actionButton: {
    padding: Spacing.xs,
  },
});
