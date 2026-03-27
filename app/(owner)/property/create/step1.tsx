import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, ScrollView, StyleSheet, Text, View } from "react-native";

import BasicInfoForm from "@/features/owner/property-create/components/BasicInfoForm";
import CreatePropertyHeader from "@/features/owner/property-create/components/CreatePropertyHeader";
import FloatingNextButton from "@/features/owner/property-create/components/FloatingNextButton";
import PropertySpecifications from "@/features/owner/property-create/components/PropertySpecifications";
import PropertyTypeGrid from "@/features/owner/property-create/components/PropertyTypeGrid";
import { useCreatePropertyEssentials } from "@/features/owner/property-create/hooks/useCreatePropertyEssentials";

const PROPERTY_TYPES = [
  {
    id: "apartment",
    label: "Apartment",
    icon: "business",
    gradient: ["#667eea", "#764ba2"],
  },
  {
    id: "house",
    label: "House",
    icon: "home",
    gradient: ["#f093fb", "#f5576c"],
  },
  {
    id: "villa",
    label: "Villa",
    icon: "leaf",
    gradient: ["#4facfe", "#00f2fe"],
  },
  {
    id: "duplex",
    label: "Duplex",
    icon: "layers",
    gradient: ["#43e97b", "#38f9d7"],
  },
  {
    id: "studio",
    label: "Studio",
    icon: "grid",
    gradient: ["#fa709a", "#fee140"],
  },
  {
    id: "penthouse",
    label: "Penthouse",
    icon: "star",
    gradient: ["#30cfd0", "#330867"],
  },
];

export default function CreatePropertyStep1() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const {
    propertyType,
    // setPropertyType,
    propertyName,
    setPropertyName,
    address,
    setAddress,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    size,
    setSize,
    handleNext,
    handlePropertyTypeSelect,
    scrollViewRef,
    fadeAnim,
    isComplete,
  } = useCreatePropertyEssentials();

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
        currentStep={1}
        totalSteps={5}
        title="Property Essentials"
        progress={0.2}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Choose Property Type
              </Text>
              <Text style={[styles.sectionDescription, { color: mutedColor }]}>
                Select the category that best describes your property
              </Text>
            </View>
            <CompletionBadge completed={!!propertyType} />
          </View>

          <PropertyTypeGrid
            propertyTypes={PROPERTY_TYPES}
            selectedType={propertyType}
            onSelect={handlePropertyTypeSelect}
          />
        </Animated.View>

        {propertyType && (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Basic Information
                </Text>
                <Text
                  style={[styles.sectionDescription, { color: mutedColor }]}
                >
                  Give your property a name and location
                </Text>
              </View>
              <CompletionBadge completed={!!propertyName && !!address} />
            </View>

            <BasicInfoForm
              propertyName={propertyName}
              setPropertyName={setPropertyName}
              address={address}
              setAddress={setAddress}
            />
          </Animated.View>
        )}

        {propertyType && propertyName && address && (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Property Specifications
                </Text>
                <Text
                  style={[styles.sectionDescription, { color: mutedColor }]}
                >
                  Define the size and layout
                </Text>
              </View>
              <CompletionBadge completed={!!size} />
            </View>

            <PropertySpecifications
              bedrooms={bedrooms}
              setBedrooms={setBedrooms}
              bathrooms={bathrooms}
              setBathrooms={setBathrooms}
              size={size}
              setSize={setSize}
            />
          </Animated.View>
        )}

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      <FloatingNextButton
        onPress={handleNext}
        label="Continue to Details"
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
