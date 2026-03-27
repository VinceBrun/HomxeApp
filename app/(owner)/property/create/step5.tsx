import React from "react";
import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";

import { useCreatePropertyReview } from "@/features/owner/property-create/hooks/useCreatePropertyReview";
import CreatePropertyHeader from "@/features/owner/property-create/components/CreatePropertyHeader";
import PropertySummaryCard from "@/features/owner/property-create/components/PropertySummaryCard";
import AdditionalInfoGrid from "@/features/owner/property-create/components/AdditionalInfoGrid";
import VisibilitySelector from "@/features/owner/property-create/components/VisibilitySelector";
import PublishActions from "@/features/owner/property-create/components/PublishActions";

export default function CreatePropertyStep5() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const {
    visibility,
    setVisibility,
    agreeToTerms,
    setAgreeToTerms,
    isPublishing,
    propertyData,
    handlePublish,
    fadeAnim,
  } = useCreatePropertyReview();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <CreatePropertyHeader
        currentStep={5}
        totalSteps={5}
        title="Review & Publish"
        progress={1.0}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Review Your Listing
          </Text>

          <PropertySummaryCard propertyData={propertyData} />

          <AdditionalInfoGrid
            photos={propertyData.photos}
            amenities={propertyData.amenities}
          />
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Visibility
          </Text>

          <VisibilitySelector
            visibility={visibility}
            setVisibility={setVisibility}
          />
        </Animated.View>

        <PublishActions
          agreeToTerms={agreeToTerms}
          setAgreeToTerms={setAgreeToTerms}
          isPublishing={isPublishing}
          onPublish={handlePublish}
          fadeAnim={fadeAnim}
        />

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.md,
  },
});
