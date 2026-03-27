import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import Spacer from "@/components/ui/Spacer";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ExistsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function UserExistsModal({ visible, onClose }: ExistsModalProps) {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
          <Text
            style={{
              fontFamily: "PoppinsBold",
              fontSize: 18,
              color: textColor,
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Account Already Exists
          </Text>
          <Text
            style={{
              fontFamily: "PoppinsRegular",
              fontSize: 14,
              color: muted,
              marginBottom: 24,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            You&apos;re already registered on Homxe. Please sign in to continue.
          </Text>
          <Button
            title="Go to Sign In"
            handlePress={() => {
              onClose();
              router.push("/sign-in");
            }}
          />
          <Spacer size="sm" />
          <Pressable onPress={onClose} className="py-3">
            <Text
              style={{
                fontFamily: "PoppinsMedium",
                fontSize: 14,
                color: muted,
                textAlign: "center",
              }}
            >
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
