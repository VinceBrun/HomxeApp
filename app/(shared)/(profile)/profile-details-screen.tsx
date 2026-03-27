import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/Form";
import Header from "@/components/ui/Header";
import KeyboardAwareScrollView from "@/components/ui/KeyboardAwareScrollView";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import ProfileHeader from "@/components/ui/profile/ProfileHeader";
import Spacer from "@/components/ui/Spacer";
import TextInput from "@/components/ui/TextInput";
import useSession from "@/hooks/shared/useSession";
import { useActiveRole } from "@/hooks/useActiveRole";
import useProfile from "@/hooks/useProfile";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

const ViewProfileSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

type ViewProfileValues = z.infer<typeof ViewProfileSchema>;

const AVATAR_BUCKET = "avatars";

export default function ProfileDetailsScreen() {
  const { profile } = useProfile();
  const { user } = useSession();
  const role = useActiveRole(); // ✅ Now syncs role with context
  const background = useThemeColor({}, "background");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<ViewProfileValues>({
    resolver: zodResolver(ViewProfileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (profile?.avatar_url && typeof profile.avatar_url === "string") {
      const { data } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(profile.avatar_url);
      setAvatarUrl(data?.publicUrl ?? null);
    }
  }, [profile?.avatar_url]);

  useEffect(() => {
    if (profile && user) {
      form.reset({
        fullName: profile.full_name || "",
        email: user.email || "",
        phone: profile.phone_number || "",
      });
    }
  }, [profile, user, form]);

  return (
    <CollapsibleHeaderView
      header={
        <SafeAreaView>
          <Header title="Profile Details" />
          <ProfileHeader
            name={profile?.full_name || "Anonymous"}
            email={user?.email || "..."}
            profilePic={avatarUrl ?? ""}
            role={role}
            onEditAvatar={undefined}
          />
        </SafeAreaView>
      }
      content={
        <SafeAreaView style={[styles.flex, { backgroundColor: background }]}>
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
                          {...field}
                          editable={false}
                          placeholder="Full Name"
                          returnKeyType="done"
                        />
                      </FormControl>
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
                          {...field}
                          editable={false}
                          placeholder="Email"
                          keyboardType="email-address"
                          returnKeyType="done"
                        />
                      </FormControl>
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
                          {...field}
                          editable={false}
                          placeholder="Phone Number"
                          keyboardType="phone-pad"
                          returnKeyType="done"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </Form>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      }
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
