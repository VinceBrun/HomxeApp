import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import useSession from "@/hooks/shared/useSession";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import mime from "mime";
import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

const ID_OPTIONS = [
  { label: "ID Card", value: "national_id" },
  { label: "Passport", value: "passport" },
  { label: "Driving License", value: "driver_license" },
];

const UploadIDScreen = () => {
  const { user } = useSession();
  const router = useRouter();

  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");
  const background = useThemeColor({}, "background");

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setChecked] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Media library access is needed to upload your ID.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const selected = ID_OPTIONS.find((opt) => opt.label === selectedOption);
    if (!selected || !isChecked || !image) {
      Alert.alert(
        "Missing Info",
        "Select ID type, upload image, and confirm ownership.",
      );
      return;
    }
    if (!user?.id) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    try {
      setIsSubmitting(true);

      const fileUri = image;
      const fileExt = fileUri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `user_${user.id}/${selected.value}.${fileExt}`;
      const contentType = mime.getType(image) || "image/jpeg";

      // ✅ Use fetch API + arrayBuffer for maximum reliability
      const response = await fetch(fileUri);
      const arrayBuffer = await response.arrayBuffer();

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("kyc-uploads")
        .upload(fileName, arrayBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const insertedPath = uploadData?.path;

      const { error: insertError } = await supabase
        .from("kyc_verifications")
        .insert([
          {
            user_id: user.id,
            id_type: selected.value,
            id_image_url: insertedPath,
            selfie_image_url: "",
            status: "pending",
          },
        ]);

      if (insertError) throw insertError;

      router.push("/take-selfie");
    } catch (error) {
      console.error("Upload ID error:", error);
      Alert.alert(
        "Upload Failed",
        "Something went wrong while uploading your ID. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CollapsibleHeaderView
      header={<Header />}
      content={
        <View className="px-6 pb-6" style={{ backgroundColor: background }}>
          <View className="items-center mt-8 mb-6">
            <Image
              source={require("@/assets/images/Image_upload_kyc.png")}
              resizeMode="contain"
              className="w-full h-48"
            />
          </View>

          <View className="items-center mb-6">
            <Text
              className="text-xl font-poppinsSemibold text-center"
              style={{ color: textColor }}
            >
              Upload a valid ID
            </Text>
            <Text
              className="text-sm font-poppins text-center mt-2"
              style={{ color: muted }}
            >
              Please upload a clear photo of your ID.
            </Text>
          </View>

          <View className="space-y-4">
            {ID_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSelectedOption(option.label)}
                className="flex-row items-center p-4 rounded-xl border"
                style={{
                  borderColor:
                    selectedOption === option.label ? primary : "#E5E7EB",
                  backgroundColor:
                    selectedOption === option.label
                      ? `${primary}10`
                      : "transparent",
                }}
              >
                <View
                  className="w-5 h-5 rounded-full border items-center justify-center mr-3"
                  style={{
                    borderColor:
                      selectedOption === option.label ? primary : "#E5E7EB",
                  }}
                >
                  {selectedOption === option.label && (
                    <View
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: primary }}
                    />
                  )}
                </View>
                <Text
                  className="text-base font-poppins"
                  style={{
                    color:
                      selectedOption === option.label ? primary : textColor,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleImagePick}
            className="mt-6 border-2 border-dashed rounded-xl p-8 items-center justify-center"
            style={{ borderColor: image ? primary : "#E5E7EB" }}
          >
            {image ? (
              <View className="items-center">
                <Image
                  source={{ uri: image }}
                  className="w-20 h-20 rounded-lg mb-2"
                />
                <Text
                  className="text-xs font-poppins"
                  style={{ color: primary }}
                >
                  Change Image
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <FontAwesome name="cloud-upload" size={32} color={primary} />
                <Text
                  className="text-sm font-poppins mt-2"
                  style={{ color: muted }}
                >
                  Upload Image
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setChecked(!isChecked)}
            className="flex-row items-center mt-6"
          >
            <View
              className="w-5 h-5 rounded border items-center justify-center mr-3"
              style={{
                borderColor: isChecked ? primary : "#E5E7EB",
                backgroundColor: isChecked ? primary : "transparent",
              }}
            >
              {isChecked && (
                <FontAwesome name="check" size={12} color="white" />
              )}
            </View>
            <Text
              className="text-xs font-poppins flex-1"
              style={{ color: muted }}
            >
              I confirm that this ID belongs to me and all information is
              correct.
            </Text>
          </TouchableOpacity>

          <Button
            title={isSubmitting ? "Uploading..." : "Continue"}
            onPress={handleSubmit}
            disabled={isSubmitting || !selectedOption || !isChecked || !image}
            className="mt-8"
          />
        </View>
      }
    />
  );
};

export default UploadIDScreen;
