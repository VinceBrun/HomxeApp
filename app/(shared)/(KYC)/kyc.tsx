/**
 * KYC Verification Entry Screen
 * Initiates the identity verification process for users.
 */

import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const KYCVerificationScreen: React.FC = () => {
  const router = useRouter();

  const background = useThemeColor({}, "background");
  const muted = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const handleAgree = () => {
    router.push("/lets-get-to-know-you");
  };

  const handlePrivacy = () => {
    router.push("/privacy-policy");
  };

  const handleTerms = () => {
    router.push("/");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
    },
    dateText: {
      textAlign: "center",
      fontSize: 13,
      color: muted,
      marginTop: 8,
      marginBottom: 24,
    },
    image: {
      width: 260,
      height: 260,
      alignSelf: "center",
      marginTop: 120,
      marginBottom: 24,
    },
    disclaimer: {
      textAlign: "center",
      color: muted,
      fontSize: 13,
      marginTop: 16,
      lineHeight: 20,
    },
    linkText: {
      color: primary,
      fontWeight: "600",
    },
  });

  return (
    <CollapsibleHeaderView
      header={
        <SafeAreaView>
          <Header title="KYC Verification" />
        </SafeAreaView>
      }
      content={
        <SafeAreaView style={styles.container} className="px-4">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <Text style={styles.dateText}>
              Provide your details to verify your account.
            </Text>

            <Image
              source={require("@/assets/images/kyc_onboarding.png")}
              style={styles.image}
              resizeMode="contain"
            />

            <Button
              title="Proceed"
              handlePress={handleAgree}
              containerStyles="mt-36"
            />

            <Text style={styles.disclaimer}>
              By clicking continue, you agree to our{" "}
              <Text style={styles.linkText} onPress={handlePrivacy}>
                Privacy Policy
              </Text>{" "}
              and{" "}
              <Text style={styles.linkText} onPress={handleTerms}>
                Terms and Conditions
              </Text>
              .
            </Text>
          </ScrollView>
        </SafeAreaView>
      }
    />
  );
};

export default KYCVerificationScreen;
