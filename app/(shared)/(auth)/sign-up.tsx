/**
 * Sign Up Screen
 * Handles new user registration and profile initialization.
 */

import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Controller } from "react-hook-form";

import EyeOffIcon from "@/assets/icons/eye-hide.png";
import EyeIcon from "@/assets/icons/eye.png";
import Button from "@/components/ui/Button";
import DividerWithText from "@/components/ui/DividerWithText";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import Heading from "@/components/ui/Heading";
import KeyboardAwareScrollView from "@/components/ui/KeyboardAwareScrollView";
import SocialAuthButtons from "@/components/ui/SocialAuthButtons";
import Spacer from "@/components/ui/Spacer";
import Spinner from "@/components/ui/Spinner";
import TextInput, { TextInputIcon } from "@/components/ui/TextInput";
import { useThemeColor } from "@/hooks/useThemeColor";

import { useSignUp } from "@/features/shared/auth/hooks/useSignUp";
import UserExistsModal from "@/features/shared/auth/components/UserExistsModal";
import TermsCheckbox from "@/features/shared/auth/components/TermsCheckbox";
import SignUpFooter from "@/features/shared/auth/components/SignUpFooter";

export default function SignUp() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const errorColor = useThemeColor({}, "secondary");

  const {
    form,
    isLoading,
    error,
    showPassword,
    setShowPassword,
    isChecked,
    setChecked,
    showExistsModal,
    setShowExistsModal,
    onSubmit,
    emailFieldRef,
    phoneFieldRef,
    passwordFieldRef,
  } = useSignUp();

  return (
    <>
      <Spinner visible={isLoading} />
      <UserExistsModal
        visible={showExistsModal}
        onClose={() => setShowExistsModal(false)}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
          <View className="px-6 pt-12">
            <Heading>Get Started</Heading>
            <Spacer size="sm" />
            <Text
              className="text-center mb-2"
              style={{
                color: muted,
                fontFamily: "PoppinsRegular",
                fontSize: 14,
              }}
            >
              by creating a free account.
            </Text>
            <Spacer size="lg" />

            <Form {...form}>
              {/* Full Name Field */}
              <Controller
                name="fullName"
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel
                      style={{ color: textColor, fontFamily: "PoppinsMedium" }}
                    >
                      Full name
                    </FormLabel>
                    <FormControl>
                      <TextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="John Doe"
                        returnKeyType="next"
                        autoFocus
                        onSubmitEditing={() => emailFieldRef.current?.focus()}
                        blurOnSubmit={false}
                        style={{
                          fontFamily: "PoppinsRegular",
                          color: textColor,
                        }}
                        placeholderTextColor={muted}
                      />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              />
              <Spacer size="md" />

              {/* Email Field */}
              <Controller
                name="email"
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel
                      style={{ color: textColor, fontFamily: "PoppinsMedium" }}
                    >
                      Valid email
                    </FormLabel>
                    <FormControl>
                      <TextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="example@gmail.com"
                        keyboardType="email-address"
                        autoComplete="email"
                        autoCapitalize="none"
                        ref={emailFieldRef}
                        returnKeyType="next"
                        onSubmitEditing={() => phoneFieldRef.current?.focus()}
                        blurOnSubmit={false}
                        style={{
                          fontFamily: "PoppinsRegular",
                          color: textColor,
                        }}
                        placeholderTextColor={muted}
                      />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              />
              <Spacer size="md" />

              {/* Phone Number Field */}
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel
                      style={{ color: textColor, fontFamily: "PoppinsMedium" }}
                    >
                      Phone number
                    </FormLabel>
                    <FormControl>
                      <TextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="123-456-7890"
                        keyboardType="phone-pad"
                        ref={phoneFieldRef}
                        returnKeyType="next"
                        onSubmitEditing={() =>
                          passwordFieldRef.current?.focus()
                        }
                        blurOnSubmit={false}
                        style={{
                          fontFamily: "PoppinsRegular",
                          color: textColor,
                        }}
                        placeholderTextColor={muted}
                      />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              />
              <Spacer size="md" />

              {/* Password Field */}
              <Controller
                name="password"
                control={form.control}
                render={({ field }) => (
                  <>
                    <FormLabel
                      style={{ color: textColor, fontFamily: "PoppinsMedium" }}
                    >
                      Strong Password
                    </FormLabel>
                    <FormControl>
                      <TextInput
                        value={field.value}
                        onChangeText={field.onChange}
                        onBlur={field.onBlur}
                        placeholder="Must be at least 8 characters"
                        secureTextEntry={!showPassword}
                        ref={passwordFieldRef}
                        returnKeyType="done"
                        onSubmitEditing={form.handleSubmit(onSubmit)}
                        right={
                          <TextInputIcon
                            icon={showPassword ? EyeOffIcon : EyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                          />
                        }
                        style={{
                          fontFamily: "PoppinsRegular",
                          color: textColor,
                        }}
                        placeholderTextColor={muted}
                      />
                    </FormControl>
                    <FormMessage />
                  </>
                )}
              />
              <Spacer size="md" />

              <TermsCheckbox
                isChecked={isChecked}
                onToggle={() => setChecked(!isChecked)}
              />

              {/* Error Message */}
              {(form.formState.errors.root || error) && (
                <View className="mb-4 p-3 bg-red-50 rounded-lg">
                  <Text
                    style={{
                      color: errorColor,
                      fontFamily: "PoppinsMedium",
                      fontSize: 13,
                      textAlign: "center",
                    }}
                  >
                    {form.formState.errors.root?.message || error?.message}
                  </Text>
                </View>
              )}

              <Button
                title={
                  form.formState.isSubmitting ? "Submitting..." : "Sign Up"
                }
                handlePress={form.handleSubmit(onSubmit)}
              />

              <SignUpFooter />
            </Form>

            <Spacer size="lg" />
            <DividerWithText />
            <Spacer size="md" />

            <SocialAuthButtons />

            <Spacer size="xxl" />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
}
