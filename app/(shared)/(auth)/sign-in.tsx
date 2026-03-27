/**
 * Sign In Screen
 * Authenticates users and handles "Remember Me" logic.
 */

import EyeOffIcon from "@/assets/icons/eye-hide.png";
import EyeIcon from "@/assets/icons/eye.png";
import Button from "@/components/ui/Button";
import DividerWithText from "@/components/ui/DividerWithText";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import Heading from "@/components/ui/Heading";
import KeyboardAwareScrollView from "@/components/ui/KeyboardAwareScrollView";
import SocialAuthButtons from "@/components/ui/SocialAuthButtons";
import Spacer from "@/components/ui/Spacer";
import Spinner from "@/components/ui/Spinner";
import Switch from "@/components/ui/Switch";
import { Text } from "@/components/ui/Text";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import useTransientSession from "@/hooks/useTransientSession";
import { useRememberMeStore } from "@/store/rememberMe.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as z from "zod";
import TextInput, { TextInputIcon } from "../../../components/ui/TextInput";

const FormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof FormSchema>;

export default function SignIn() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "secondary");
  const primary = useThemeColor({}, "primary");

  const safeContainerStyle = {
    flex: 1,
    backgroundColor: background,
  };

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  const secondFieldRef = useRef<RNTextInput>(null);
  const [showPassword, setShowPassword] = useState(false);

  const rememberMe = useRememberMeStore((state) => state.rememberMe);
  const setRememberMe = useRememberMeStore((state) => state.setRememberMe);
  const rememberedEmail = useRememberMeStore((state) => state.email);
  const setRememberedEmail = useRememberMeStore((state) => state.setEmail);

  useEffect(() => {
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
    }
  }, [rememberedEmail, form]);

  const { signIn, isLoading, error } = useTransientSession();

  const onSubmit = async (values: FormValues) => {
    Keyboard.dismiss();
    await signIn(
      {
        email: values.email,
        password: values.password,
      },
      () => {
        if (rememberMe) {
          setRememberedEmail(values.email);
        } else {
          setRememberedEmail(null);
        }
        router.dismissAll();
        router.replace("/(shared)/auth-hub");
      },
    );
  };

  return (
    <>
      <Spinner visible={isLoading} />

      <SafeAreaView style={safeContainerStyle} onLayout={onLayoutRootView}>
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <View style={{ flex: 1 }}>
              <Heading>Welcome Back</Heading>
              <Spacer size="sm" />
              <Text
                className="text-md text-center mb-2 mx-auto w-4/5"
                style={{ color: textColor, fontFamily: "PoppinsRegular" }}
              >
                Sign in to access your account.
              </Text>
              <Spacer size="xs" />

              {error && (
                <Text
                  variant="h5"
                  style={{ color: errorColor, fontFamily: "PoppinsMedium" }}
                >
                  {error.message}
                </Text>
              )}

              <Spacer size="lg" />

              <Form {...form}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormItem>
                      <FormLabel
                        style={{
                          fontFamily: "PoppinsMedium",
                          color: textColor,
                        }}
                      >
                        Email
                      </FormLabel>
                      <FormControl>
                        <TextInput
                          keyboardType="email-address"
                          autoComplete="email"
                          autoCapitalize="none"
                          placeholder="example@gmail.com"
                          placeholderTextColor={muted}
                          textContentType="emailAddress"
                          returnKeyType="next"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          onSubmitEditing={() =>
                            secondFieldRef.current?.focus()
                          }
                          blurOnSubmit={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Spacer size="sm" />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormItem>
                      <FormLabel
                        style={{
                          fontFamily: "PoppinsMedium",
                          color: textColor,
                        }}
                      >
                        Password
                      </FormLabel>
                      <FormControl>
                        <TextInput
                          ref={secondFieldRef}
                          placeholder="Must be at least 8 characters"
                          placeholderTextColor={muted}
                          secureTextEntry={!showPassword}
                          textContentType="oneTimeCode"
                          autoCapitalize="none"
                          autoComplete="off"
                          returnKeyType="done"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          onSubmitEditing={form.handleSubmit(onSubmit)}
                          blurOnSubmit={false}
                          right={
                            <TextInputIcon
                              icon={showPassword ? EyeOffIcon : EyeIcon}
                              onPress={() => setShowPassword(!showPassword)}
                              color={muted}
                              rippleColor="transparent"
                              size={18}
                              style={{ opacity: 0.8 }}
                            />
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Spacer size="xs" />

                <View style={[styles.row, { justifyContent: "space-between" }]}>
                  <View style={styles.row}>
                    <Switch value={rememberMe} onValueChange={setRememberMe} />
                    <Text
                      variant="h5"
                      style={{ color: textColor, fontFamily: "PoppinsMedium" }}
                    >
                      Keep me signed in
                    </Text>
                  </View>

                  <Link href="/forgot-password" asChild>
                    <TouchableOpacity>
                      <Text
                        variant="h5"
                        style={{ color: primary, fontFamily: "PoppinsMedium" }}
                      >
                        Forgot password?
                      </Text>
                    </TouchableOpacity>
                  </Link>
                </View>

                <Spacer size="lg" />

                <Button
                  title={isLoading ? "Signing In..." : "Sign In"}
                  handlePress={form.handleSubmit(onSubmit)}
                  loading={isLoading}
                  style={{ width: "100%" }}
                />
              </Form>

              <Spacer size="xs" />
              <DividerWithText />
              <Spacer size="xs" />
              <SocialAuthButtons />
              <Spacer size="xs" />
            </View>

            <Spacer size="xxl" />

            <View style={styles.footer}>
              <Text style={{ color: textColor, fontFamily: "PoppinsMedium" }}>
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text style={{ color: primary, fontFamily: "PoppinsBold" }}>
                    Sign up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
