import React from "react";
import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import Radius from "@/constants/RADIUS";
import { Ionicons } from "@expo/vector-icons";

import { useCreatePropertyAmenities } from "@/features/owner/property-create/hooks/useCreatePropertyAmenities";
import CreatePropertyHeader from "@/features/owner/property-create/components/CreatePropertyHeader";
import DescriptionInput from "@/features/owner/property-create/components/DescriptionInput";
import AmenitiesSelector from "@/features/owner/property-create/components/AmenitiesSelector";
import HouseRulesInput from "@/features/owner/property-create/components/HouseRulesInput";
import AvailabilityInput from "@/features/owner/property-create/components/AvailabilityInput";
import FloatingNextButton from "@/features/owner/property-create/components/FloatingNextButton";

const AMENITIES = [
  { id: "parking", label: "Parking", icon: "car", value: "parking" },
  { id: "wifi", label: "WiFi", icon: "wifi", value: "wifi" },
  { id: "ac", label: "AC", icon: "snow", value: "ac" },
  {
    id: "security",
    label: "Security",
    icon: "shield-checkmark",
    value: "security",
  },
  { id: "generator", label: "Generator", icon: "flash", value: "generator" },
  { id: "pool", label: "Pool", icon: "water", value: "pool" },
  { id: "gym", label: "Gym", icon: "barbell", value: "gym" },
  { id: "garden", label: "Garden", icon: "leaf", value: "garden" },
  { id: "balcony", label: "Balcony", icon: "home", value: "balcony" },
  { id: "furnished", label: "Furnished", icon: "bed", value: "furnished" },
  { id: "pets", label: "Pet Friendly", icon: "paw", value: "pets" },
  { id: "kitchen", label: "Kitchen", icon: "restaurant", value: "kitchen" },
  { id: "laundry", label: "Laundry", icon: "shirt", value: "laundry" },
  { id: "elevator", label: "Elevator", icon: "arrow-up", value: "elevator" },
  { id: "storage", label: "Storage", icon: "cube", value: "storage" },
  { id: "heater", label: "Heater", icon: "flame", value: "heater" },
  {
    id: "playground",
    label: "Playground",
    icon: "football",
    value: "playground",
  },
  { id: "fireplace", label: "Fireplace", icon: "bonfire", value: "fireplace" },
];

export default function CreatePropertyStep2() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const {
    description,
    setDescription,
    selectedAmenities,
    toggleAmenity,
    houseRules,
    updateHouseRule,
    availableFrom,
    setAvailableFrom,
    handleNext,
    scrollViewRef,
    fadeAnim,
    isComplete,
  } = useCreatePropertyAmenities();

  const CompletionBadge = ({ completed }: { completed: boolean }) => (
    <View
      style={[
        styles.completionBadge,
        { borderColor: completed ? primary : mutedColor },
        completed && { backgroundColor: primary },
      ]}
    >
      {completed && <Ionicons name="checkmark-circle" size={16} color="#fff" />}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <CreatePropertyHeader
        currentStep={2}
        totalSteps={5}
        title="Amenities & Details"
        progress={0.4}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Description Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Property Description
              </Text>
              <Text style={[styles.sectionDescription, { color: mutedColor }]}>
                Describe your property in detail to attract the right tenants
              </Text>
            </View>
            <CompletionBadge completed={description.length >= 50} />
          </View>

          <DescriptionInput
            description={description}
            setDescription={setDescription}
          />
        </Animated.View>

        {/* Amenities Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Available Amenities
              </Text>
              <Text style={[styles.sectionDescription, { color: mutedColor }]}>
                Select all amenities available at your property
              </Text>
            </View>
            <CompletionBadge completed={selectedAmenities.length > 0} />
          </View>

          <AmenitiesSelector
            amenities={AMENITIES}
            selectedAmenities={selectedAmenities}
            toggleAmenity={toggleAmenity}
          />
        </Animated.View>

        {/* House Rules Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                House Rules
              </Text>
              <Text style={[styles.sectionDescription, { color: mutedColor }]}>
                Add up to 3 important rules (optional)
              </Text>
            </View>
          </View>

          <HouseRulesInput
            houseRules={houseRules}
            updateHouseRule={updateHouseRule}
          />
        </Animated.View>

        {/* Availability Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Availability
              </Text>
              <Text style={[styles.sectionDescription, { color: mutedColor }]}>
                When can tenants move in?
              </Text>
            </View>
          </View>

          <AvailabilityInput
            availableFrom={availableFrom}
            setAvailableFrom={setAvailableFrom}
          />
        </Animated.View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      <FloatingNextButton
        onPress={handleNext}
        label="Continue to Pricing"
        visible={!!isComplete}
        fadeAnim={fadeAnim}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.xxxs,
  },
  sectionDescription: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
  },
  completionBadge: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
