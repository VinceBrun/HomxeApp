import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { shareProperty } from "@/utils/deepLinking";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Landlord, ReviewWithTenant } from "../types/propertyDetails.types";

export const usePropertyDetails = (id: string) => {
  const { profile } = useProfile();

  const [property, setProperty] = useState<Property | null>(null);
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [reviews, setReviews] = useState<ReviewWithTenant[]>([]);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const fetchPropertyDetails = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch property with landlord info
      const { data: propertyData, error: propertyError } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (propertyError) throw propertyError;

      setProperty(propertyData);

      // Fetch landlord details
      if (propertyData?.landlord_id) {
        const { data: landlordData } = await supabase
          .from("profiles")
          .select("id, full_name, avatar_url, phone_number")
          .eq("id", propertyData.landlord_id)
          .single();

        if (landlordData) setLandlord(landlordData);
      }

      // Fetch reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          tenant:profiles!tenant_id(full_name, avatar_url)
        `,
        )
        .eq("property_id", id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (reviewsData) setReviews(reviewsData as any);

      // Fetch similar properties
      if (propertyData?.type) {
        const { data: similarData } = await supabase
          .from("properties")
          .select("*")
          .eq("type", propertyData.type)
          .eq("is_available", true)
          .neq("id", id)
          .limit(4);

        if (similarData) setSimilarProperties(similarData);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkIfSaved = useCallback(async () => {
    if (!profile?.id) return;

    const { data } = await supabase
      .from("saved_properties")
      .select("id")
      .eq("property_id", id)
      .eq("tenant_id", profile.id)
      .single();

    setIsSaved(!!data);
  }, [id, profile?.id]);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
      checkIfSaved();
    }
  }, [id, fetchPropertyDetails, checkIfSaved]);

  const toggleSave = async () => {
    if (!profile?.id) {
      Alert.alert("Sign In Required", "Please sign in to save properties");
      return;
    }

    try {
      if (isSaved) {
        await supabase
          .from("saved_properties")
          .delete()
          .eq("property_id", id)
          .eq("tenant_id", profile.id);
        setIsSaved(false);
      } else {
        await supabase
          .from("saved_properties")
          .insert({ property_id: id, tenant_id: profile.id });
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    }
  };

  /**
   * UPDATED: Share with deep linking
   * Generates: https://homxe.app/property/[id]
   */
  const handleShare = async () => {
    if (!property) {
      Alert.alert("Error", "Property data not available");
      return;
    }

    try {
      await shareProperty(property);
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "Failed to share property");
    }
  };

  return {
    property,
    landlord,
    reviews,
    similarProperties,
    loading,
    isSaved,
    toggleSave,
    handleShare,
    refetch: fetchPropertyDetails,
  };
};
