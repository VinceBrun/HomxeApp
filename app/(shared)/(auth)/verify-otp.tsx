import Button from "@/components/ui/Button";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isSubmitting, setSubmitting] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();

  const background = useThemeColor({}, "background");
  const card = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const highlight = useThemeColor({}, "primary");

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      router.push("/change-password");
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <View style={styles.imageWrapper}>
        <Image
          source={require("@/assets/images/email-verifcation.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <View style={styles.textGroup}>
        <Text style={[styles.title, { color: textColor }]}>
          OTP VERIFICATION
        </Text>

        <Text style={[styles.subtitle, { color: muted }]}>
          Enter the OTP sent to -{" "}
          <Text style={{ fontFamily: "PoppinsSemibold", color: textColor }}>
            da********@gmail.com
          </Text>
        </Text>
      </View>

      <View style={styles.inputRow}>
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputRefs.current[index] = ref;
            }}
            value={value}
            onChangeText={(text) => handleOtpChange(index, text)}
            maxLength={1}
            keyboardType="numeric"
            style={[
              styles.otpInput,
              {
                backgroundColor: card,
                color: textColor,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 3,
              },
            ]}
          />
        ))}
      </View>

      <Text
        style={{
          color: muted,
          fontFamily: "PoppinsRegular",
          fontSize: 14,
          marginBottom: Spacing.md,
        }}
      >
        00:120 Sec
      </Text>

      <View style={styles.resendRow}>
        <Text
          style={{
            color: muted,
            fontFamily: "PoppinsRegular",
            fontSize: 14,
          }}
        >
          Don’t receive code?
        </Text>
        <TouchableOpacity onPress={() => router.push("/verify-otp")}>
          <Text
            style={{
              fontFamily: "PoppinsSemibold",
              color: highlight,
              fontSize: 14,
              marginLeft: 6,
            }}
          >
            Re-send
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Submit"
        handlePress={submit}
        isLoading={isSubmitting}
        containerStyles="mt-7 w-full"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xxl,
    alignItems: "center",
    justifyContent: "center",
  },
  imageWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  image: {
    width: "100%",
    height: 260,
  },
  textGroup: {
    width: "100%",
    alignItems: "center",
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: Spacing.md,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
  },
  resendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
});

export default OTPVerification;
