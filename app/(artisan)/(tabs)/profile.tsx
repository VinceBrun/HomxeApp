/**
 * Seeker Profile Tab
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
import { personaService } from "@/services/persona";
import { OptionProps } from "@/types";
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import mime from "mime";
import React, { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AVATAR_BUCKET = "avatars";

const ALL_PERSONA_TYPES = ["seeker", "owner", "artisan"] as const;

const PERSONA_LABELS: Record<string, string> = {
  seeker: "Seeker (Tenant)",
  owner: "Owner (Landlord)",
  artisan: "Artisan (Service Provider)",
};

const PERSONA_ICONS: Record<string, any> = {
  seeker: "search-outline",
  owner: "home-outline",
  artisan: "construct-outline",
};

const ProfileScreen = () => {
  const { profile, refetch } = useProfile();
  const { user, signOut, allPersonas, activePersona, switchPersona, refetchPersonas } = useSession();
  const role = useActiveRole();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
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

  const handleSwitchPersona = useCallback(async (personaId: string, type: string) => {
    Alert.alert(
      "Switch Persona",
      `Switch to ${PERSONA_LABELS[type] || type}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch",
          onPress: async () => {
            try {
              await switchPersona(personaId);
              await refetchPersonas();
              router.replace("/(shared)/(auth)/auth-hub");
            } catch {
              Alert.alert("Error", "Could not switch persona. Please try again.");
            }
          },
        },
      ],
    );
  }, [switchPersona, refetchPersonas]);

  const handleAddAndSwitchPersona = useCallback(async (type: "seeker" | "owner" | "artisan") => {
    Alert.alert(
      "Add Persona",
      `Add ${PERSONA_LABELS[type]} to your account and switch to it?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add & Switch",
          onPress: async () => {
            try {
              const newPersona = await personaService.upsertPersona(type);
              await switchPersona(newPersona.id);
              await refetchPersonas();
              router.replace("/(shared)/(auth)/auth-hub");
            } catch {
              Alert.alert("Error", "Could not add persona. Please try again.");
            }
          },
        },
      ],
    );
  }, [switchPersona, refetchPersonas]);

  const onEditAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.7,
        base64: true,
      });

      if (result.canceled) return;

      const image = result.assets[0];
      const fileExt = image.uri.split(".").pop() || "jpg";
      const path = `public/${user?.id}-${Date.now()}.${fileExt}`;
      const contentType = mime.getType(image.uri) || "image/jpeg";

      if (!image.base64) throw new Error("Failed to get base64 image data");

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, Buffer.from(image.base64, "base64"), {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;
      await supabase.from("profiles").update({ avatar_url: path }).eq("id", user?.id);
      if (profile?.avatar_url && profile.avatar_url !== path) {
        await supabase.storage.from(AVATAR_BUCKET).remove([profile.avatar_url]);
      }
      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
      setAvatarUrl(data?.publicUrl || null);
      refetch?.();
    } catch (err) {
      Alert.alert("Upload Failed", err instanceof Error ? err.message : "Unknown error");
    }
  };

  const { kycStatus } = useKYC(user?.id);

  // Personas user already has (excluding current)
  const existingOtherPersonas = (allPersonas || []).filter(
    (p) => p.id !== activePersona?.id
  );

  // Persona types user doesn't have at all
  const existingTypes = (allPersonas || []).map((p) => p.type);
  const missingPersonaTypes = ALL_PERSONA_TYPES.filter(
    (t) => !existingTypes.includes(t)
  );

  // Build switch options for existing personas
  const switchOptions: OptionProps[] = existingOtherPersonas.map((persona) => ({
    type: "button" as const,
    icon: PERSONA_ICONS[persona.type] || "swap-horizontal-outline",
    title: `Switch to ${PERSONA_LABELS[persona.type] || persona.type}`,
    onPress: () => handleSwitchPersona(persona.id, persona.type),
  }));

  // Build add options for missing personas
  const addOptions: OptionProps[] = missingPersonaTypes.map((type) => ({
    type: "button" as const,
    icon: PERSONA_ICONS[type] || "add-circle-outline",
    title: `Add ${PERSONA_LABELS[type]}`,
    onPress: () => handleAddAndSwitchPersona(type),
  }));

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
    ...switchOptions,
    ...addOptions,
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
