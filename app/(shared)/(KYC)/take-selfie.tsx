import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/user.store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

const TakeSelfieScreen = () => {
  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { profile } = useUserStore();

  const handleTakeSelfie = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Denied",
        "Camera access is required to take a selfie.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      cameraType: ImagePicker.CameraType.front,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelfieUri(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    if (!selfieUri) {
      Alert.alert("Selfie Required", "Please take a selfie before proceeding.");
      return;
    }

    try {
      setIsSubmitting(true);
      const ext = selfieUri.split(".").pop();
      const selfiePath = `user_${profile?.id ?? ""}/selfie.${ext}`;

      // ✅ Use fetch API + arrayBuffer for maximum reliability
      const response = await fetch(selfieUri);
      const arrayBuffer = await response.arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("kyc-uploads")
        .upload(selfiePath, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: latestRecord, error: fetchError } = await supabase
        .from("kyc_verifications")
        .select("id")
        .eq("user_id", profile?.id ?? "")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (fetchError || !latestRecord) {
        throw new Error("Could not find pending KYC record.");
      }

      const { error: updateError } = await supabase
        .from("kyc_verifications")
        .update({ selfie_image_url: selfiePath })
        .eq("id", latestRecord.id);

      if (updateError) throw updateError;

      router.push("/completed");
    } catch (error) {
      console.error("Selfie upload error:", error);
      Alert.alert(
        "Upload Failed",
        "Could not upload selfie. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CollapsibleHeaderView
      header={<Header />}
      content={
        <View className="px-6 pb-6 h-full bg-white">
          <View className="items-center mt-12 mb-8">
            <View
              className="w-64 h-64 rounded-full border-4 border-dashed items-center justify-center overflow-hidden"
              style={{ borderColor: "#E5E7EB" }}
            >
              {selfieUri ? (
                <Image source={{ uri: selfieUri }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera-outline" size={64} color="#9CA3AF" />
                  <Text className="text-sm font-poppins mt-2 text-gray-400">
                    Your face here
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="items-center mb-10">
            <Text className="text-xl font-poppinsSemibold text-center">
              Take a Selfie
            </Text>
            <Text className="text-sm font-poppins text-center mt-2 text-gray-500">
              We need to verify your identity. Please make sure your face is
              well-lit and clearly visible.
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleTakeSelfie}
            className="bg-gray-100 p-4 rounded-xl items-center mb-6"
          >
            <Text className="text-base font-poppinsMedium text-gray-700">
              {selfieUri ? "Retake Photo" : "Open Camera"}
            </Text>
          </TouchableOpacity>

          <Button
            title={isSubmitting ? "Verifying..." : "Complete Verification"}
            onPress={handleNext}
            disabled={isSubmitting || !selfieUri}
          />
        </View>
      }
    />
  );
};

export default TakeSelfieScreen;
