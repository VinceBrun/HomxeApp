import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const KYCCompletedScreen: React.FC = () => {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const secondary = useThemeColor({}, "secondary");

  const handleBackToHome = () => {
    router.push("/sign-in");
  };

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
            <View
              style={{
                backgroundColor: "#E6F4EC",
                borderRadius: 100,
                padding: 30,
              }}
            >
              <Ionicons name="checkmark-circle" size={120} color="#196606" />
            </View>
          </View>

          <View className="items-center mb-10">
            <Text
              className="text-2xl font-poppinsSemibold text-center"
              style={{ color: textColor }}
            >
              KYC Completed
            </Text>
            <Text
              className="text-sm font-poppins text-center mt-2"
              style={{ color: secondary }}
            >
              Thanks for submitting your documents. We&apos;ll verify them and
              complete your KYC as soon as possible.
            </Text>
          </View>

          <View className="items-center">
            <Button
              icon="arrow-back"
              iconPosition="left"
              onPress={handleBackToHome}
              style={{ width: 320 }}
            >
              Back to Home
            </Button>
          </View>
        </SafeAreaView>
      }
    />
  );
};

export default KYCCompletedScreen;
