/**
 * Role Badge Component
 * Displays the user's active role (Seeker, Owner, or Artisan) in a stylized badge.
 */

import { Text } from "@/components/ui/Text";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import type { Role } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  role: Role;
};

const roleLabels: Record<Role, string> = {
  seeker: "Seeker",
  owner: "Owner",
  artisan: "Artisan",
};

const RoleBadge: React.FC<Props> = ({ role }) => {
  const background = useThemeColor({}, "primary");
  const foreground = useThemeColor({}, "text");

  return (
    <View style={[styles.roleContainer, { backgroundColor: background }]}>
      <Text style={[styles.roleText, { color: foreground }]}>
        {roleLabels[role]}
      </Text>
    </View>
  );
};

export default RoleBadge;

const styles = StyleSheet.create({
  roleContainer: {
    paddingVertical: 2,
    paddingHorizontal: Spacing.xxs,
    borderRadius: Radius.full,
  },
  roleText: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: "600",
  },
});
