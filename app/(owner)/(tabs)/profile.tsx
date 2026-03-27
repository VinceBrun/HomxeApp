/**
 * Owner Profile Tab
 * Management of landlord settings, identity verification, and persona switching.
 */

import Header from "@/components/ui/Header";
import IDVerifiedBadge from "@/components/ui/IDVerifiedBadge";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import ProfileHeader from "@/components/ui/profile/ProfileHeader";
import OptionsListScreen from "@/components/ui/profile/options/OptionsListScreen";
import useSession from "@/hooks/shared/useSession";
import { useActiveRole } from "@/hooks/useActiveRole";
import useKYC from "@/hooks/useKYC";
import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { OptionProps } from "@/types";
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AVATAR_BUCKET = "avatars";

const ProfileScreen = () => {
  const { profile, refetch } = useProfile();
  const { user, signOut } = useSession();
  const role = useActiveRole();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    // ✅ FIX: Check if avatar_url exists AND is a string before calling getPublicUrl
    if (profile?.avatar_url && typeof profile.avatar_url === "string") {
      const { data } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(profile.avatar_url);
      setAvatarUrl(data?.publicUrl || null);
    }
  }, [profile?.avatar_url]);

  const onLogout = useCallback(() => {
    signOut();
  }, [signOut]);

  const onEditAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      const fileExt = image.uri.split(".").pop() || "jpg";
      const path = `public/${user?.id}-${Date.now()}.${fileExt}`;
      const contentType = mime.getType(image.uri) || "image/jpeg";

      if (!image.base64) {
        throw new Error("Failed to get base64 image data");
      }

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, Buffer.from(image.base64, "base64"), {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      await supabase
        .from("profiles")
        .update({ avatar_url: path })
        .eq("id", user?.id);

      if (profile?.avatar_url && profile.avatar_url !== path) {
        await supabase.storage.from(AVATAR_BUCKET).remove([profile.avatar_url]);
      }

      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
      setAvatarUrl(data?.publicUrl || null);
      refetch?.();
    } catch (err) {
      console.error("Avatar upload error:", err);
      Alert.alert(
        "Upload Failed",
        err instanceof Error ? err.message : "Unknown error",
      );
    }
  };

  const { kycStatus } = useKYC(user?.id);

  const profileOptionsList: OptionProps[] = [
    {
      type: "navigator",
      destination: "/(profile)/profile-details-screen",
      icon: "person-outline",
      title: "Profile Details",
    },
    {
      type: "navigator",
      destination: "/(profile)/settings",
      icon: "settings-outline",
      title: "Settings",
    },
    {
      type: "navigator",
      destination: "/kyc",
      icon: "shield-checkmark-outline",
      title: "Identity Verification",
      titleSuffix: <IDVerifiedBadge status={kycStatus} />,
    },
    {
      type: "navigator",
      destination: "/",
      icon: "wallet-outline",
      title: "Payment Details",
    },
    {
      type: "dangerButton",
      icon: "log-out-outline",
      onProceed: onLogout,
      title: "Log Out",
      warningActionButtonText: "Log out",
      warningDescription: "Are you sure you want to log out?",
      warningIcon: "log-out",
    },
  ];

  return (
    <CollapsibleHeaderView
      header={
        <SafeAreaView>
          <Header title="Profile" />
          <ProfileHeader
            name={profile?.full_name || "Anonymous"}
            email={user?.email || "..."}
            profilePic={avatarUrl ?? ""}
            role={role}
            onEditAvatar={onEditAvatar}
          />
        </SafeAreaView>
      }
      content={<OptionsListScreen optionsList={profileOptionsList} />}
    />
  );
};

export default ProfileScreen;
