/**
 * Create/Update Property Hook
 * Orchestrates image uploads and database persistence for listings.
 */

import { supabase } from "@/lib/supabase";
import { useSession } from "@/providers/session";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated } from "react-native";
import { usePropertyCreate } from "../context/PropertyCreateContext";

export const useCreatePropertyReview = () => {
  const router = useRouter();
  const { user } = useSession();
  const { data: formData, resetData } = usePropertyCreate();
  const params = useLocalSearchParams<{ editMode?: string; propertyId?: string }>();

  const isEditMode = params?.editMode === "true";
  const propertyId = params?.propertyId;

  const [isPublishing, setIsPublishing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fadeAnim]);

  // Form data summary for review UI
  const propertyData = {
    type: formData.propertyType,
    name: formData.propertyName,
    address: formData.address,
    bedrooms: formData.bedrooms,
    bathrooms: formData.bathrooms,
    size: formData.size,
    monthlyRent: formData.monthlyRent,
    photos: formData.photos.length,
    amenities: formData.selectedAmenities.length,
  };

  // Uploads local images to Supabase Storage
  const uploadImages = async (imageUris: string[]): Promise<string[]> => {
    if (!user?.id) throw new Error("User not authenticated");

    const uploadedUrls: string[] = [];
    const total = imageUris.length;
    const BUCKET = "properties";

    for (let i = 0; i < imageUris.length; i++) {
      const imageUri = imageUris[i];
      if (imageUri.startsWith("http")) {
        uploadedUrls.push(imageUri);
        setUploadProgress(Math.round(((i + 1) / total) * 100));
        continue;
      }

      try {
        const response = await fetch(imageUri);
        const arrayBuffer = await response.arrayBuffer();
        const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = `property-images/${user.id}/${Date.now()}-${i}.${fileExt}`;

        const { error } = await supabase.storage.from(BUCKET).upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt === "png" ? "png" : "jpeg"}`,
          upsert: false,
        });
        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
        uploadedUrls.push(publicUrl);
        setUploadProgress(Math.round(((i + 1) / total) * 100));
      } catch (error: any) {
        throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
      }
    }
    return uploadedUrls;
  };

  // Main logic for publishing/updating property listings
  const handlePublish = async () => {
    if (!agreeToTerms) return Alert.alert("Terms Required", "Please agree to the terms and conditions");
    if (!user?.id) return Alert.alert("Authentication Error", "User session not found");

    setIsPublishing(true);
    try {
      const uploadedImageUrls = await uploadImages(formData.photos);
      const { data: dbAmenities } = await supabase.from("amenities").select("id, name");

      const propertyData = {
        landlord_id: user.id,
        title: formData.propertyName,
        description: formData.description || `${formData.propertyType} for rent`,
        type: formData.propertyType.toLowerCase(),
        category: formData.propertyType.toLowerCase(),
        location: formData.address,
        price: parseFloat(formData.monthlyRent) || 0,
        images: uploadedImageUrls,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        square_feet: parseFloat(formData.size) || 0,
        is_available: true,
        status: "listed",
        latitude: 4.8156,
        longitude: 7.0498,
        security_deposit: formData.securityDeposit,
        agent_fee: formData.agentFee,
        legal_fee: formData.legalFee,
        payment_terms: formData.selectedPaymentTerms,
        lease_duration: formData.leaseDuration,
        available_from: formData.availableFrom,
        house_rules: formData.houseRules,
        facilities: { amenities: formData.selectedAmenities },
      };

      let resultPropertyId: string;
      if (isEditMode && propertyId) {
        const { data, error } = await supabase.from("properties").update(propertyData).eq("id", propertyId).select().single();
        if (error) throw new Error(error.message);
        resultPropertyId = data.id;
        await supabase.from("property_amenities").delete().eq("property_id", propertyId);
      } else {
        const { data, error } = await supabase.from("properties").insert(propertyData).select().single();
        if (error) throw new Error(error.message);
        resultPropertyId = data.id;
      }

      if (formData.selectedAmenities.length > 0 && dbAmenities) {
        const propertyAmenities = formData.selectedAmenities.map(label => {
          const amenity = dbAmenities.find(a => a.name.toLowerCase() === label.toLowerCase());
          return amenity ? { property_id: resultPropertyId, amenity_id: amenity.id } : null;
        }).filter(Boolean);
        if (propertyAmenities.length > 0) await supabase.from("property_amenities").insert(propertyAmenities);
      }

      resetData();

      Alert.alert(
        `Success! 🎉`,
        isEditMode
          ? "Property updated successfully!"
          : "Property published successfully!",
        [
          {
            text: "View Properties",
            onPress: () => router.replace("/(owner)/(tabs)/properties"),
          },
        ],
      );
    } catch (error: any) {
      console.error("Error publishing/updating property:", error);
      Alert.alert(
        isEditMode ? "Update Failed" : "Publishing Failed",
        error.message || "An unexpected error occurred. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsPublishing(false);
      setUploadProgress(0);
    }
  };

  return {
    visibility,
    setVisibility,
    agreeToTerms,
    setAgreeToTerms,
    isPublishing,
    uploadProgress,
    propertyData,
    handlePublish,
    fadeAnim,
    isEditMode,
  };
};
