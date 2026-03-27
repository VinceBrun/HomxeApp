import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

interface TermsCheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
}

export default function TermsCheckbox({ isChecked, onToggle }: TermsCheckboxProps) {
  const router = useRouter();
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const highlight = useThemeColor({}, "primary");
  const checkmarkColor = useThemeColor({}, "card");

  return (
    <View className="flex-row items-start mb-4">
      <Pressable
        onPress={onToggle}
        style={{
          width: 20,
          height: 20,
          marginRight: 10,
          marginTop: 2,
          borderRadius: 4,
          borderWidth: 1.5,
          borderColor: isChecked ? highlight : muted,
          backgroundColor: isChecked ? highlight : background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isChecked && (
          <FontAwesome name="check" size={12} color={checkmarkColor} />
        )}
      </Pressable>
      <View className="flex-1 flex-row flex-wrap">
        <Text
          style={{
            fontFamily: "PoppinsRegular",
            fontSize: 12,
            color: textColor,
            lineHeight: 18,
          }}
        >
          By checking the box you agree to our{" "}
        </Text>
        <Pressable onPress={() => router.push("/privacyPolicy")}>
          <Text
            style={{
              fontFamily: "PoppinsSemibold",
              fontSize: 12,
              color: highlight,
              lineHeight: 18,
            }}
          >
            Terms and Conditions
          </Text>
        </Pressable>
        <Text
          style={{
            fontFamily: "PoppinsRegular",
            fontSize: 12,
            color: textColor,
            lineHeight: 18,
          }}
        >
          .
        </Text>
      </View>
    </View>
  );
}
