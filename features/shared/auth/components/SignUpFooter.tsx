import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function SignUpFooter() {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const highlight = useThemeColor({}, "primary");

  return (
    <View className="mt-6 flex-row justify-center">
      <Text
        style={{
          color: textColor,
          fontFamily: "PoppinsRegular",
          fontSize: 14,
        }}
      >
        Already have an account?{" "}
      </Text>
      <Pressable onPress={() => router.push("/sign-in")}>
        <Text
          style={{
            color: highlight,
            fontFamily: "PoppinsSemibold",
            fontSize: 14,
          }}
        >
          Sign In
        </Text>
      </Pressable>
    </View>
  );
}
