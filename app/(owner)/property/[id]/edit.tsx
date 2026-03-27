import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { usePropertyCreate } from "@/features/owner/property-create/context/PropertyCreateContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function EditPropertyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateData, resetData } = usePropertyCreate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");

  useEffect(() => {
    const loadPropertyForEdit = async () => {
      if (!id) {
        setError("No property ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch property from database
        const { data: property, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (!property) {
          setError("Property not found");
          setLoading(false);
          return;
        }

        // Reset context first
        resetData();

        // Pre-fill context with existing property data
        updateData({
          // Step 1: Essentials
          propertyType: property.type || "",
          propertyName: property.title || "",
          address: property.location || "",
          bedrooms: property.bedrooms || 2,
          bathrooms: property.bathrooms || 2,
          size: property.square_feet?.toString() || "",

          // Step 2: Details
          description: property.description || "",
          selectedAmenities: property.facilities
            ? Object.keys(property.facilities).filter(
                (key) => property.facilities[key],
              )
            : [],
          houseRules: property.house_rules || ["", "", ""],
          availableFrom: property.available_from || "",

          // Step 3: Pricing
          monthlyRent: property.price?.toString() || "",
          securityDeposit: property.security_deposit?.toString() || "",
          agentFee: property.agent_fee?.toString() || "",
          legalFee: property.legal_fee?.toString() || "",
          selectedPaymentTerms: property.payment_terms || [],
          leaseDuration: property.lease_duration || "",

          // Step 4: Photos
          photos: property.images || [],
          coverPhotoIndex: 0,

          // Step 5: Review
          visibility: "public",
          agreeToTerms: true,
        });

        // Navigate to step 1 with edit mode flag
        router.replace({
          pathname: "/(owner)/property/create/step1",
          params: { editMode: "true", propertyId: id },
        });
      } catch (err) {
        console.error("Error loading property:", err);
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    loadPropertyForEdit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <ActivityIndicator size="large" color={primary} />
        <Text style={[styles.loadingText, { color: textColor }]}>
          Loading property for editing...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Text style={[styles.errorText, { color: textColor }]}>{error}</Text>
      </View>
    );
  }

  return null; // Will redirect to step1
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  loadingText: {
    fontSize: Typography.fontSize.h4,
    fontFamily: "PoppinsRegular",
    marginTop: Spacing.md,
    textAlign: "center",
  },
  errorText: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemibold",
    textAlign: "center",
  },
});
