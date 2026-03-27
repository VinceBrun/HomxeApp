/**
 * Profile Header Component
 * Displays user profile information, including avatar, name, email, and role badge.
 */

import Heading from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import RoleBadge from "@/components/ui/profile/RoleBagde";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Role } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Avatar from "../Avatar";

type Props = {
  name?: string;
  email?: string;
  profilePic: string;
  role?: Role;
  onEditAvatar?: () => void;
  minimal?: boolean;
};

const ProfileHeader: React.FC<Props> = ({
  name,
  email,
  role,
  profilePic,
  onEditAvatar,
  minimal = false,
}) => {
  const background = useThemeColor({}, "background");
  const muted = useThemeColor({}, "icon");

  return (
    <View style={[styles.header, { backgroundColor: background }]}>
      <View style={styles.avatarContainer}>
        <Pressable onPress={onEditAvatar} disabled={!onEditAvatar}>
          <Avatar size={150} imageUri={profilePic} />
          {onEditAvatar && (
            <View style={styles.editIconContainer}>
              <Ionicons name="create-outline" size={20} color="white" />
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.textContainer}>
        {!minimal && name && <Heading>{name}</Heading>}
        {!minimal && email && (
          <Text style={{ color: muted, fontFamily: "PoppinsRegular" }}>
            {email}
          </Text>
        )}
        {role && <RoleBadge role={role} />}
      </View>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    width: "100%",
  },
  avatarContainer: {
    position: "relative",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "black",
    borderRadius: 12,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginTop: 12,
    gap: 4,
    alignItems: "center",
  },
});
