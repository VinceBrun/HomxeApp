/**
 * Entry Point / Onboarding Screen
 * Handles onboarding flow and redirects to auth if already completed.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/Button";
import { Colors } from "@/constants/COLORS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useColorScheme } from "@/hooks/useColorScheme";

import OnboardingImage1 from "@/assets/images/onboarding.png";
import OnboardingImage2 from "@/assets/images/onboarding1.png";
import OnboardingImage3 from "@/assets/images/onboarding2.png";

type Slide = {
  key: string;
  title: string;
  text: string;
  image: any;
  backgroundColor: string;
};

export default function Index() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const router = useRouter();
  const sliderRef = useRef<AppIntroSlider>(null);

  const [isChecking, setIsChecking] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  // Check if user has completed onboarding
  useEffect(() => {
    checkOnboarding();
  }, []);

  async function checkOnboarding() {
    try {
      const completed = await AsyncStorage.getItem("onboardingCompleted");
      setHasCompletedOnboarding(completed === "true");
    } catch (error) {
      console.error("Error checking onboarding:", error);
    } finally {
      setIsChecking(false);
    }
  }

  const slides: Slide[] = [
    {
      key: "one",
      title: "Your Home, Reimagined",
      text: "Find your new home with just a tap.",
      image: OnboardingImage1,
      backgroundColor: theme.background,
    },
    {
      key: "two",
      title: "Smart living starts here!",
      text: "Effortlessly connect to your perfect home.",
      image: OnboardingImage2,
      backgroundColor: theme.background,
    },
    {
      key: "three",
      title: "Future Housing",
      text: "Smart solution for easy home search and rental",
      image: OnboardingImage3,
      backgroundColor: theme.background,
    },
  ];

  const onDone = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true");
    setHasCompletedOnboarding(true);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error("Onboarding submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item, index }: { item: Slide; index: number }) => {
    const isFirst = index === 0;
    const isSecond = index === 1;
    const isLast = index === slides.length - 1;

    return (
      <SafeAreaView
        className="flex-1"
        style={{
          backgroundColor: theme.background,
          paddingTop: Spacing.xxl,
        }}
      >
        <Pressable
          style={{
            position: "absolute",
            top: Spacing.lg,
            right: Spacing.md,
            zIndex: 10,
          }}
          onPress={() =>
            isLast
              ? onDone()
              : sliderRef.current?.goToSlide(slides.length - 1, true)
          }
        >
          <Text
            className="text-lg font-poppinsMedium"
            style={{ color: theme.outlineText }}
          >
            {isLast ? "Done" : "Skip"}
          </Text>
        </Pressable>

        <View className="flex-1 items-center justify-center">
          <Image
            source={item.image}
            resizeMode="contain"
            style={styles.image}
          />
        </View>

        <View
          className="flex-1"
          style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.lg }}
        >
          <View className="items-center">
            <Text
              className="font-poppinsBold text-center"
              style={{
                fontSize: Typography.fontSize.h2,
                lineHeight: Typography.lineHeight.h2,
                color: theme.text,
              }}
            >
              {item.title}
            </Text>
            <Text
              className="pt-5 font-poppins text-center"
              style={{
                fontSize: Typography.fontSize.h5,
                lineHeight: Typography.lineHeight.h5,
                color: theme.text,
              }}
            >
              {item.text}
            </Text>
          </View>

          <View className="flex-1 justify-center items-center gap-4">
            {(isFirst || isSecond) && (
              <>
                <Pressable onPress={async () => {
                  await AsyncStorage.setItem("onboardingCompleted", "true");
                  router.push("/sign-up");
                }}>
                  <Text
                    className="text-lg font-poppins text-center"
                    style={{ color: theme.text }}
                  >
                    Create an account
                  </Text>
                </Pressable>

                <View className="flex-row items-center">
                  <Text
                    className="text-md font-poppins text-center"
                    style={{ color: theme.text }}
                  >
                    Already have an account?{" "}
                  </Text>
                  <Pressable onPress={async () => {
                    await AsyncStorage.setItem("onboardingCompleted", "true");
                    router.push("/sign-in");
                  }}>
                    <Text
                      className="text-md font-poppins"
                      style={{ color: theme.primary }}
                    >
                      Sign in
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {isLast && (
              <>
                <Button
                  title="Get Started"
                  handlePress={submit}
                  containerStyles="mt-7 w-full"
                  isLoading={isSubmitting}
                />

                <View
                  className="flex-row items-center"
                  style={{ marginTop: Spacing.xxs }}
                >
                  <Text
                    className="text-md font-poppins text-center"
                    style={{ color: theme.text }}
                  >
                    Already have an account?{" "}
                  </Text>
                  <Pressable onPress={async () => {
                    await AsyncStorage.setItem("onboardingCompleted", "true");
                    router.push("/sign-in");
                  }}>
                    <Text
                      className="text-md font-poppinsSemibold"
                      style={{ color: theme.primary }}
                    >
                      Sign in
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  };

  // Show loading while checking
  if (isChecking) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // If onboarding completed, redirect to auth-hub
  if (hasCompletedOnboarding) {
    return <Redirect href="/(shared)/(auth)/auth-hub" />;
  }

  // Show onboarding
  return (
    <AppIntroSlider
      ref={sliderRef}
      renderItem={renderItem}
      data={slides}
      dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      activeDotStyle={{ backgroundColor: theme.primary }}
      onDone={onDone}
      renderNextButton={() => null}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
});
