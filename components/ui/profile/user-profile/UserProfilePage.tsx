import UserProfileScreen from "@/components/ui/profile/user-profile/UserProfileScreen";
import Spinner from "@/components/ui/Spinner";
import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { FormFieldInitialType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as FileSystem from "expo-file-system/legacy";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const AVATAR_BUCKET = "avatars";

const FormSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z.string().min(7, "Phone number must be valid"),
});

type FormData = z.infer<typeof FormSchema>;

const formFields: FormFieldInitialType<FormData>[] = [
  {
    formLabel: "Full Name",
    name: "fullName",
    textContentType: "name",
    autoCapitalize: "words",
    autoComplete: "name",
    placeholder: "Bruno Lincoln",
    maxLength: 50,
    fieldIndex: 0,
  },
  {
    formLabel: "Phone Number",
    name: "phoneNumber",
    keyboardType: "phone-pad",
    textContentType: "telephoneNumber",
    autoComplete: "tel",
    placeholder: "+2348123456789",
    maxLength: 15,
    fieldIndex: 1,
  },
];

const UserProfilePage = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  const {
    profile,
    isUpdateProfileLoading,
    updateProfileError,
    isGetProfileLoading,
    getProfileError,
    updateProfile,
  } = useProfile();

  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const deleteOldImage = async (oldPath: string) => {
    try {
      const path = oldPath.split(`${AVATAR_BUCKET}/`)[1];
      if (!path) return;
      await supabase.storage.from(AVATAR_BUCKET).remove([path]);
    } catch (error) {
      console.error("Delete image error:", error);
    }
  };

  const uploadImageToSupabase = async (uri: string): Promise<string | null> => {
    try {
      setIsUploading(true);

      const ext = uri.split(".").pop();
      const path = `profile-pics/${Date.now()}.${ext}`;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64" as any,
      });

      const binary = atob(base64.replace(/^data:image\/\w+;base64,/, ""));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, bytes, {
          contentType: `image/${ext}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      if (profile?.avatar) await deleteOldImage(profile.avatar);

      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
      return data?.publicUrl ?? null;
    } catch (err) {
      console.error("Upload failed:", err);
      Alert.alert("Image Upload Error", "Failed to upload image.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: FormData) => {
    Keyboard.dismiss();
    const avatarUrl = localImageUri
      ? await uploadImageToSupabase(localImageUri)
      : profile?.avatar;

    await updateProfile(
      {
        full_name: values.fullName,
        phone_number: values.phoneNumber,
        avatar_url: avatarUrl || null,
      },
      () => router.canGoBack() && router.back(),
    );
  };

  const onImageSelect = useCallback((uri: string) => {
    setLocalImageUri(uri);
  }, []);

  useEffect(() => {
    if (!isUpdateProfileLoading && !updateProfileError && profile) {
      form.setValue("fullName", profile.fullName || "");
      form.setValue("phoneNumber", profile.phoneNumber || "");
    }
  }, [profile, isUpdateProfileLoading, updateProfileError, form]);

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <Spinner visible={isUpdateProfileLoading || isUploading} />
      <UserProfileScreen
        {...{ form, formFields, onSubmit, onImageSelect }}
        isLoading={isGetProfileLoading}
        error={getProfileError}
        updateError={updateProfileError}
        alwaysRenderButton={!!localImageUri}
      />
    </SafeAreaView>
  );
};

export default UserProfilePage;
