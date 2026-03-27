/**
 * Edit Profile Screen
 * Allows users to update their personal information and profile picture.
 */

import { zodResolver } from "@hookform/resolvers/zod";
import { Buffer } from "buffer";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  Keyboard,
  // SafeAreaView as RNSafeAreaView, // replaced: use from react-native-safe-area-context
  StyleSheet,
  View,
} from "react-native";
import {
  SafeAreaView as RNSafeAreaView,
  SafeAreaView,
} from "react-native-safe-area-context";
import * as z from "zod";

import useSession from "@/hooks/shared/useSession";
import { useActiveRole } from "@/hooks/useActiveRole";
import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";

import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import KeyboardAwareScrollView from "@/components/ui/KeyboardAwareScrollView";
import Spacer from "@/components/ui/Spacer";
import TextInput from "@/components/ui/TextInput";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import ProfileHeader from "@/components/ui/profile/ProfileHeader";
import { useThemeColor } from "@/hooks/useThemeColor";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";

const AVATAR_BUCKET = "avatars";

const EditProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

type EditProfileValues = z.infer<typeof EditProfileSchema>;

export default function EditProfileScreen() {
  const { profile, refetch } = useProfile();
  const { user } = useSession();
  const role = useActiveRole();
  const background = useThemeColor({}, "background");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<EditProfileValues>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (profile && user) {
      form.reset({
        fullName: profile.full_name,
        email: user.email ?? "",
        phone: profile.phone_number ?? "",
      });
    }
  }, [profile, user, form]);

  useEffect(() => {
    if (profile?.avatar_url && typeof profile.avatar_url === "string") {
      const { data } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(profile.avatar_url);
      setAvatarUrl(data?.publicUrl ?? null);
    }
  }, [profile?.avatar_url]);

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
      setAvatarUrl(data?.publicUrl ?? null);
      refetch?.();
    } catch (err) {
      console.error("Avatar upload error:", err);
      Alert.alert(
        "Upload Failed",
        err instanceof Error ? err.message : "Unknown error",
      );
    }
  };

  const onSubmit = async (values: EditProfileValues) => {
    Keyboard.dismiss();

    const { fullName, phone } = values;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone_number: phone })
      .eq("id", user?.id);

    if (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Update Failed", "Please try again.");
    } else {
      await refetch();
      Alert.alert("Success", "Profile updated");
    }
  };

  return (
    <CollapsibleHeaderView
      header={
        <SafeAreaView>
          <Header title="Edit Profile" />
          <ProfileHeader
            name={profile?.full_name}
            email={user?.email}
            profilePic={avatarUrl ?? ""}
            role={role}
            onEditAvatar={onEditAvatar}
          />
        </SafeAreaView>
      }
      content={
        <RNSafeAreaView style={{ flex: 1, backgroundColor: background }}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.container}>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <TextInput
                          value={field.value}
                          onChangeText={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Full Name"
                          autoCapitalize="words"
                          returnKeyType="next"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Spacer size="sm" />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <TextInput
                          value={field.value}
                          onBlur={field.onBlur}
                          placeholder="Email"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          editable={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Spacer size="sm" />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <TextInput
                          value={field.value}
                          onChangeText={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Phone Number"
                          keyboardType="phone-pad"
                          returnKeyType="done"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>

              <Spacer size="xl" />
              <Button
                title="Save Changes"
                handlePress={form.handleSubmit(onSubmit)}
                containerStyles="mt-4"
              />
              <Spacer size="xl" />
            </View>
          </KeyboardAwareScrollView>
        </RNSafeAreaView>
      }
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
});
