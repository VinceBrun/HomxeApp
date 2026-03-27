/**
 * Property Details Screen — Seeker View
 * Full property information with actions: save, share, book tour, pay rent.
 */

import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useFavorites } from "@/hooks/useFavorites";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import PropertyActions from "@/features/seeker/property/components/PropertyActions";
import PropertyAmenities from "@/features/seeker/property/components/PropertyAmenities";
import PropertyDescription from "@/features/seeker/property/components/PropertyDescription";
import PropertyHeader from "@/features/seeker/property/components/PropertyHeader";
import PropertyHost from "@/features/seeker/property/components/PropertyHost";
import PropertyImageGallery from "@/features/seeker/property/components/PropertyImageGallery";
import PropertyLocation from "@/features/seeker/property/components/PropertyLocation";
import PropertyReviews from "@/features/seeker/property/components/PropertyReviews";
import PropertySimilar from "@/features/seeker/property/components/PropertySimilar";
import { usePropertyDetails } from "@/features/seeker/property/hooks/usePropertyDetails";

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    property,
    landlord,
    reviews,
    similarProperties,
    loading,
    handleShare,
  } = usePropertyDetails(id);

  const { isSaved, toggleSave } = useFavorites();

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");

  const scrollY = useRef(new Animated.Value(0)).current;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(seeker)/(tabs)/home");
    }
  };

  const handleBookTour = () => {
    router.push(`/(seeker)/booking/${id}`);
  };

  const handleContact = () => {
    if (!landlord?.phone_number) {
      Alert.alert(
        "Contact Unavailable",
        "This landlord hasn't provided a phone number.",
      );
      return;
    }

    Alert.alert(
      "Contact Landlord",
      `Choose how you want to contact ${landlord.full_name}`,
      [
        {
          text: "WhatsApp",
          onPress: () => {
            const message = `Hi, I'm interested in your property: ${property?.title}`;
            const url = `whatsapp://send?phone=${landlord.phone_number}&text=${encodeURIComponent(message)}`;
            Linking.openURL(url).catch(() => {
              Alert.alert("Error", "WhatsApp is not installed on your device");
            });
          },
        },
        {
          text: "Call",
          onPress: () => {
            Linking.openURL(`tel:${landlord.phone_number}`);
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  // ── Loading ────────────────────────────────────────────────────────────────
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

  // ── Not found ──────────────────────────────────────────────────────────────
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

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  // ── Full screen ────────────────────────────────────────────────────────────
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
          onToggleSave={() => toggleSave(id)}
          isSaved={isSaved(id)}
        />

        <View
          style={[styles.contentContainer, { backgroundColor: background }]}
        >
          {/* Title, location, price */}
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

          {/* Badges */}
          <View style={styles.metaRow}>
            <View
              style={[styles.metaBadge, { backgroundColor: `${tertiary}15` }]}
            >
              <Ionicons name="star" size={16} color={tertiary} />
              <Text style={[styles.metaText, { color: textColor }]}>
                {averageRating} ({reviews.length})
              </Text>
            </View>
            <View
              style={[styles.metaBadge, { backgroundColor: `${primary}15` }]}
            >
              <Ionicons name="home" size={16} color={primary} />
              <Text style={[styles.metaText, { color: textColor }]}>
                {property.type}
              </Text>
            </View>
            {property.is_available && (
              <View
                style={[styles.metaBadge, { backgroundColor: "#10B98115" }]}
              >
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={[styles.metaText, { color: textColor }]}>
                  Available
                </Text>
              </View>
            )}
          </View>

          {/* Quick specs */}
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

          <PropertyLocation
            latitude={property.latitude}
            longitude={property.longitude}
            location={property.location}
          />

          <PropertyHost landlord={landlord} onContact={handleContact} />

          <PropertyReviews reviews={reviews} averageRating={averageRating} />

          <PropertySimilar similarProperties={similarProperties} />

          {/* Space so last content clears the action bar */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom action bar — includes Pay Rent button */}
      <PropertyActions
        propertyId={id}
        propertyTitle={property.title}
        price={property.price}
        landlordId={landlord?.id}
        onBookTour={handleBookTour}
        onShare={handleShare}
      />
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
    fontFamily: "PoppinsSemiBold",
    marginTop: Spacing.md,
  },
  backHomeButton: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  backHomeText: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemiBold",
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
});
