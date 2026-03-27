import Button from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EmailVerificationSuccessful = () => {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");

  const [isSubmitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 items-center justify-center p-6"
      style={{ backgroundColor: background }}
    >
      <Image
        source={require("@/assets/images/verify-img.png")}
        className="w-100 h-100 mb-8"
        resizeMode="contain"
      />

      <Text
        className="text-xl font-poppinsSemibold text-center mb-4"
        style={{ color: text }}
      >
        Email Verification Successful
      </Text>
      <Text
        className="text-center mb-12 font-poppinsLight"
        style={{ color: muted }}
      >
        Congratulations! You have successfully verified your email.
      </Text>

      <View className="flex-row justify-center">
        <View className="w-full mb-8">
          <Button
            title="Done"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationSuccessful;
