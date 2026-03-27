import { zodResolver } from "@hookform/resolvers/zod";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";

import EyeOffIcon from "@/assets/icons/eye-hide.png";
import EyeIcon from "@/assets/icons/eye.png";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import KeyboardAwareScrollView from "@/components/ui/KeyboardAwareScrollView";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import Spacer from "@/components/ui/Spacer";
import { Text } from "@/components/ui/Text";
import TextInput, { TextInputIcon } from "@/components/ui/TextInput";
import { useThemeColor } from "@/hooks/useThemeColor";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import Spacing from "@/constants/SPACING";

const ChangePasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;

export default function ChangePassword() {
  const background = useThemeColor({}, "background");
  const muted = useThemeColor({}, "icon");

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const confirmRef = useRef<any>(null);

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  const onSubmit = async (values: ChangePasswordValues) => {
    Keyboard.dismiss();
    console.log("Submitted passwords:", values);
    // TODO: connect to password update logic
  };

  return (
    <CollapsibleHeaderView
      header={<Header title="Change Password" />}
      content={
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: background }]}
          onLayout={onLayoutRootView}
        >
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
          >
            <View style={styles.container}>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <TextInput
                          {...field}
                          placeholder="Must be 8 characters"
                          secureTextEntry={!showNewPassword}
                          textContentType="oneTimeCode"
                          autoCapitalize="none"
                          autoComplete="off"
                          returnKeyType="next"
                          onSubmitEditing={() => confirmRef.current?.focus()}
                          blurOnSubmit={false}
                          right={
                            <TextInputIcon
                              icon={showNewPassword ? EyeOffIcon : EyeIcon}
                              onPress={() =>
                                setShowNewPassword((prev) => !prev)
                              }
                              color={muted}
                              rippleColor="transparent"
                              size={18}
                              style={{ opacity: 0.8 }}
                            />
                          }
                          placeholderTextColor={muted}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Spacer size="sm" />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <TextInput
                          {...field}
                          ref={confirmRef}
                          placeholder="Re-enter password"
                          secureTextEntry={!showConfirmPassword}
                          textContentType="oneTimeCode"
                          autoCapitalize="none"
                          autoComplete="off"
                          returnKeyType="done"
                          onSubmitEditing={form.handleSubmit(onSubmit)}
                          blurOnSubmit={false}
                          right={
                            <TextInputIcon
                              icon={showConfirmPassword ? EyeOffIcon : EyeIcon}
                              onPress={() =>
                                setShowConfirmPassword((prev) => !prev)
                              }
                              color={muted}
                              rippleColor="transparent"
                              size={18}
                              style={{ opacity: 0.8 }}
                            />
                          }
                          placeholderTextColor={muted}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Form>

              <View style={styles.footer}>
                <Spacer size="xl" />
                <View style={styles.infoBox}>
                  <Text style={[styles.infoText, { color: muted }]}>
                    Make sure your new password is strong.
                  </Text>
                  <Text style={[styles.infoText, { color: muted }]}>
                    Press the button below to update.
                  </Text>
                </View>
                <Spacer size="md" />
                <Button
                  title="Change Password"
                  handlePress={form.handleSubmit(onSubmit)}
                  isLoading={form.formState.isSubmitting}
                  containerStyles="mt-7"
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      }
    />
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "flex-start",
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  infoBox: {
    alignItems: "center",
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 2,
  },
});
