import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import PropertyAmenities from "@/features/seeker/property/components/PropertyAmenities";
import PropertyDescription from "@/features/seeker/property/components/PropertyDescription";
import PropertyHeader from "@/features/seeker/property/components/PropertyHeader";
import PropertyImageGallery from "@/features/seeker/property/components/PropertyImageGallery";
import PropertyLocation from "@/features/seeker/property/components/PropertyLocation";
import { Property } from "@/types";

export default function OwnerPropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(owner)/(tabs)/properties");
    }
  };

  const handleShare = async () => {
    if (!property) return;

    try {
      const message = `Check out my property: ${property.title}\n₦${property.price?.toLocaleString()}/mo\n${property.location}`;

      await Share.share({
        message: message,
        title: property.title,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/(owner)/property/${id}/edit`);
  };

  const handleMoreOptions = () => {
    Alert.alert("Property Options", "Manage your property", [
      {
        text: "View Analytics",
        onPress: () => router.push(`/(owner)/property/${id}/analytics`),
      },
      {
        text: "Change Status",
        onPress: handleChangeStatus,
      },
      {
        text: "Promote Listing",
        onPress: () => console.log("Promote listing"),
      },
      {
        text: "Archive Property",
        onPress: handleArchive,
        style: "destructive",
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const handleChangeStatus = () => {
    Alert.alert("Change Status", "Select new status", [
      { text: "Listed", onPress: () => updateStatus("listed") },
      { text: "Rented", onPress: () => updateStatus("rented") },
      { text: "Maintenance", onPress: () => updateStatus("maintenance") },
      { text: "Draft", onPress: () => updateStatus("draft") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const updateStatus = async (newStatus: string) => {
    if (!id) return;

    try {
      const { error } = await supabase
        .from("properties")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      Alert.alert("Success", "Property status updated");

      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

      if (data) setProperty(data);
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Failed to update status");
    }
  };

  const handleArchive = () => {
    Alert.alert(
      "Archive Property?",
      "This will remove the property from active listings",
      [
        {
          text: "Archive",
          style: "destructive",
          onPress: () => updateStatus("delisted"),
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={primary} />
        <Text style={[styles.loadingText, { color: mutedColor }]}>
          Loading property...
        </Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <Ionicons name="home-outline" size={64} color={mutedColor} />
        <Text style={[styles.errorText, { color: textColor }]}>
          Property not found
        </Text>
        <TouchableOpacity onPress={handleBack} style={styles.backHomeButton}>
          <Text style={[styles.backHomeText, { color: primary }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["https://via.placeholder.com/400x300?text=No+Image"];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "listed":
        return { label: "Active", color: "#10B981", bg: "#10B98115" };
      case "rented":
        return { label: "Rented", color: "#3B82F6", bg: "#3B82F615" };
      case "maintenance":
        return { label: "Maintenance", color: "#F59E0B", bg: "#F59E0B15" };
      case "draft":
        return { label: "Draft", color: "#6B7280", bg: "#6B728015" };
      case "delisted":
        return { label: "Archived", color: "#EF4444", bg: "#EF444415" };
      default:
        return { label: status, color: mutedColor, bg: mutedColor + "15" };
    }
  };

  const statusConfig = getStatusConfig(property.status);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <PropertyHeader
        title={property.title}
        scrollY={scrollY}
        onBack={handleBack}
        onShare={handleShare}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        <PropertyImageGallery
          images={images}
          scrollY={scrollY}
          onBack={handleBack}
          onShare={handleShare}
          onToggleSave={() => {}}
          isSaved={false}
        />

        <View
          style={[styles.contentContainer, { backgroundColor: background }]}
        >
          {/* Title & Price */}
          <View style={styles.headerSection}>
            <View style={styles.titleContainer}>
              <Text style={[styles.propertyTitle, { color: textColor }]}>
                {property.title}
              </Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={16} color={mutedColor} />
                <Text style={[styles.locationText, { color: mutedColor }]}>
                  {property.location}
                </Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={[styles.priceAmount, { color: primary }]}>
                ₦{property.price?.toLocaleString()}
              </Text>
              <Text style={[styles.priceFrequency, { color: mutedColor }]}>
                /month
              </Text>
            </View>
          </View>

          {/* Meta Row */}
          <View style={styles.metaRow}>
            <TouchableOpacity
              style={[styles.metaBadge, { backgroundColor: statusConfig.bg }]}
              onPress={handleChangeStatus}
            >
              <Ionicons name="ellipse" size={10} color={statusConfig.color} />
              <Text style={[styles.metaText, { color: textColor }]}>
                {statusConfig.label}
              </Text>
            </TouchableOpacity>

            <View
              style={[styles.metaBadge, { backgroundColor: `${primary}15` }]}
            >
              <Ionicons name="home" size={16} color={primary} />
              <Text style={[styles.metaText, { color: textColor }]}>
                {property.type}
              </Text>
            </View>

            <View
              style={[styles.metaBadge, { backgroundColor: `${tertiary}15` }]}
            >
              <Ionicons name="eye-outline" size={16} color={tertiary} />
              <Text style={[styles.metaText, { color: textColor }]}>
                {property.views_count || 0} views
              </Text>
            </View>
          </View>

          {/* Quick Specs */}
          <View style={[styles.specsCard, { backgroundColor: cardBg }]}>
            <View style={styles.specItem}>
              <Ionicons name="bed-outline" size={24} color={primary} />
              <Text style={[styles.specValue, { color: textColor }]}>
                {property.bedrooms || "N/A"}
              </Text>
              <Text style={[styles.specLabel, { color: mutedColor }]}>
                Bedrooms
              </Text>
            </View>
            <View
              style={[styles.specDivider, { backgroundColor: mutedColor }]}
            />
            <View style={styles.specItem}>
              <Ionicons name="water-outline" size={24} color={primary} />
              <Text style={[styles.specValue, { color: textColor }]}>
                {property.bathrooms || "N/A"}
              </Text>
              <Text style={[styles.specLabel, { color: mutedColor }]}>
                Bathrooms
              </Text>
            </View>
            <View
              style={[styles.specDivider, { backgroundColor: mutedColor }]}
            />
            <View style={styles.specItem}>
              <Ionicons name="expand-outline" size={24} color={primary} />
              <Text style={[styles.specValue, { color: textColor }]}>
                {property.square_feet || "N/A"}
              </Text>
              <Text style={[styles.specLabel, { color: mutedColor }]}>
                sq ft
              </Text>
            </View>
          </View>

          <PropertyDescription description={property.description} />

          <PropertyAmenities
            facilities={property.facilities as Record<string, boolean>}
          />

          {/* ✅ NEW: House Rules Section */}
          {property.house_rules && property.house_rules.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                House Rules
              </Text>
              <View style={[styles.rulesCard, { backgroundColor: cardBg }]}>
                {property.house_rules.map(
                  (rule: string, index: number) =>
                    rule && (
                      <View key={index} style={styles.ruleItem}>
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={primary}
                        />
                        <Text style={[styles.ruleText, { color: textColor }]}>
                          {rule}
                        </Text>
                      </View>
                    ),
                )}
              </View>
            </View>
          )}

          {/* ✅ NEW: Pricing Details Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Pricing Details
            </Text>
            <View style={[styles.pricingCard, { backgroundColor: cardBg }]}>
              <View style={styles.pricingRow}>
                <Text style={[styles.pricingLabel, { color: mutedColor }]}>
                  Monthly Rent
                </Text>
                <Text style={[styles.pricingValue, { color: textColor }]}>
                  ₦{property.price?.toLocaleString()}
                </Text>
              </View>

              {property.security_deposit && (
                <View style={styles.pricingRow}>
                  <Text style={[styles.pricingLabel, { color: mutedColor }]}>
                    Security Deposit
                  </Text>
                  <Text style={[styles.pricingValue, { color: textColor }]}>
                    ₦{Number(property.security_deposit).toLocaleString()}
                  </Text>
                </View>
              )}

              {property.agent_fee && (
                <View style={styles.pricingRow}>
                  <Text style={[styles.pricingLabel, { color: mutedColor }]}>
                    Agent Fee
                  </Text>
                  <Text style={[styles.pricingValue, { color: textColor }]}>
                    ₦{Number(property.agent_fee).toLocaleString()}
                  </Text>
                </View>
              )}

              {property.legal_fee && (
                <View style={styles.pricingRow}>
                  <Text style={[styles.pricingLabel, { color: mutedColor }]}>
                    Legal Fee
                  </Text>
                  <Text style={[styles.pricingValue, { color: textColor }]}>
                    ₦{Number(property.legal_fee).toLocaleString()}
                  </Text>
                </View>
              )}

              {property.lease_duration && (
                <View style={styles.pricingRow}>
                  <Text style={[styles.pricingLabel, { color: mutedColor }]}>
                    Lease Duration
                  </Text>
                  <Text style={[styles.pricingValue, { color: textColor }]}>
                    {property.lease_duration}
                  </Text>
                </View>
              )}

              {property.payment_terms && property.payment_terms.length > 0 && (
                <View style={[styles.pricingRow, { alignItems: "flex-start" }]}>
                  <Text style={[styles.pricingLabel, { color: mutedColor }]}>
                    Payment Terms
                  </Text>
                  <View style={styles.paymentTerms}>
                    {property.payment_terms.map(
                      (term: string, index: number) => (
                        <View
                          key={index}
                          style={[
                            styles.termBadge,
                            { backgroundColor: `${primary}15` },
                          ]}
                        >
                          <Text style={[styles.termText, { color: primary }]}>
                            {term}
                          </Text>
                        </View>
                      ),
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* ✅ NEW: Availability Section */}
          {property.available_from && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Availability
              </Text>
              <View
                style={[styles.availabilityCard, { backgroundColor: cardBg }]}
              >
                <Ionicons name="calendar-outline" size={24} color={primary} />
                <View style={styles.availabilityInfo}>
                  <Text
                    style={[styles.availabilityLabel, { color: mutedColor }]}
                  >
                    Available From
                  </Text>
                  <Text style={[styles.availabilityDate, { color: textColor }]}>
                    {new Date(property.available_from).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <PropertyLocation
            latitude={property.latitude}
            longitude={property.longitude}
            location={property.location}
          />

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.actionsContainer, { backgroundColor: cardBg }]}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              { borderColor: textColor + "20", borderWidth: 1 },
            ]}
            onPress={handleEdit}
          >
            <Ionicons name="create-outline" size={22} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.iconButton,
              { borderColor: textColor + "20", borderWidth: 1 },
            ]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={22} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: primary }]}
            onPress={handleMoreOptions}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  loadingText: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsRegular",
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsSemibold",
    marginTop: Spacing.md,
  },
  backHomeButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  backHomeText: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemibold",
  },
  contentContainer: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    marginTop: -Radius.lg,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  headerSection: { marginBottom: Spacing.md },
  titleContainer: { marginBottom: Spacing.xs },
  propertyTitle: {
    fontSize: Typography.fontSize.h1,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.xxxs,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxxs,
  },
  locationText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: Spacing.xs,
  },
  priceAmount: {
    fontSize: 28,
    fontFamily: "PoppinsBold",
  },
  priceFrequency: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    marginLeft: Spacing.xxxs,
  },
  metaRow: {
    flexDirection: "row",
    gap: Spacing.xs,
    marginBottom: Spacing.md,
    flexWrap: "wrap",
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxxs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxxs,
    borderRadius: Radius.sm,
  },
  metaText: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsMedium",
  },
  specsCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  specItem: { alignItems: "center", flex: 1 },
  specValue: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    marginTop: Spacing.xxxs,
  },
  specLabel: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    marginTop: Spacing.xxxs,
  },
  specDivider: { width: 1, height: 40, opacity: 0.2 },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemibold",
    marginBottom: Spacing.sm,
  },
  rulesCard: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  ruleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  ruleText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
  pricingCard: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.xs,
  },
  pricingLabel: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
  },
  pricingValue: {
    fontSize: Typography.fontSize.h4,
    fontFamily: "PoppinsSemibold",
  },
  paymentTerms: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    flex: 1,
    justifyContent: "flex-end",
  },
  termBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxxs,
    borderRadius: Radius.sm,
  },
  termText: {
    fontSize: 12,
    fontFamily: "PoppinsMedium",
  },
  availabilityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: Radius.md,
    gap: Spacing.md,
  },
  availabilityInfo: {
    flex: 1,
  },
  availabilityLabel: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    marginBottom: 2,
  },
  availabilityDate: {
    fontSize: Typography.fontSize.h4,
    fontFamily: "PoppinsSemibold",
  },
  actionsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 20,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
