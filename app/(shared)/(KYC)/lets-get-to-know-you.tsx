/**
 * KYC Step Selection Screen
 * Guides the user through the required verification steps (ID upload and selfie).
 */

import Header from "@/components/ui/Header";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LetsGetToKnowYouScreen: React.FC = () => {
  const router = useRouter();

  const textColor = useThemeColor({}, "text");
  const subtitleColor = useThemeColor({}, "tertiary");
  const iconColor = useThemeColor({}, "primary");

  const SectionItem = ({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-start justify-between mb-6"
      activeOpacity={0.8}
    >
      <View className="flex-row flex-1 pr-4">
        <View className="mt-1 mr-4">{icon}</View>
        <View>
          <Text
            className="text-base font-semibold font-poppinsSemibold mb-1"
            style={{ color: textColor }}
          >
            {title}
          </Text>
          <Text
            className="text-sm font-poppins"
            style={{ color: subtitleColor }}
          >
            {subtitle}
          </Text>
        </View>
      </View>
      <Feather name="chevron-right" size={20} color={iconColor} />
    </TouchableOpacity>
  );

  return (
    <CollapsibleHeaderView
      header={
        <SafeAreaView>
          <Header />
        </SafeAreaView>
      }
      content={
        <SafeAreaView className="flex-1 px-4 pb-6">
          <View className="items-center mt-12 mb-24">
            <Image
              source={require("@/assets/images/gtky_kyc.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </View>

          <View className="items-center mb-8">
            <Text
              className="text-2xl font-poppinsSemibold text-center"
              style={{ color: textColor }}
            >
              Let’s get to know you
            </Text>
            <Text
              className="text-sm font-poppins text-center mt-2"
              style={{ color: subtitleColor }}
            >
              In order to complete your registration, submit the following;
            </Text>
          </View>

          <View className="mt-2">
            <SectionItem
              icon={<Feather name="credit-card" size={20} color={iconColor} />}
              title="A picture of your valid ID"
              subtitle="To check that your information is correct"
              onPress={() => router.push("/upload-id")}
            />
            <SectionItem
              icon={<Feather name="camera" size={20} color={iconColor} />}
              title="A selfie"
              subtitle="To match your face with your ID photo"
              onPress={() => router.push("/take-selfie")}
            />
          </View>
        </SafeAreaView>
      }
    />
  );
};

export default LetsGetToKnowYouScreen;

const styles = StyleSheet.create({
  image: {
    width: 240,
    height: 240,
  },
});
