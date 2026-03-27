import React from "react";
import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import Radius from "@/constants/RADIUS";
import { Ionicons } from "@expo/vector-icons";

import { useCreatePropertyPhotos } from "@/features/owner/property-create/hooks/useCreatePropertyPhotos";
import CreatePropertyHeader from "@/features/owner/property-create/components/CreatePropertyHeader";
import FloatingNextButton from "@/features/owner/property-create/components/FloatingNextButton";
import PhotoGuidelines from "@/features/owner/property-create/components/PhotoGuidelines";
import PhotoGrid from "@/features/owner/property-create/components/PhotoGrid";

export default function CreatePropertyStep4() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const {
    photos,
    coverPhotoIndex,
    setCoverPhotoIndex,
    pickImages,
    removePhoto,
    handleNext,
    fadeAnim,
    isComplete,
    remainingPhotos,
  } = useCreatePropertyPhotos();

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
        currentStep={4}
        totalSteps={5}
        title="Photos"
        progress={0.8}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Property Gallery
              </Text>
              <Text style={[styles.sectionDescription, { color: mutedColor }]}>
                Add photos to showcase your property
              </Text>
            </View>
            <CompletionBadge completed={photos.length >= 3} />
          </View>

          <PhotoGuidelines />
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <PhotoGrid
            photos={photos}
            coverPhotoIndex={coverPhotoIndex}
            onRemove={removePhoto}
            onSetCover={setCoverPhotoIndex}
            onAdd={pickImages}
            remainingPhotos={remainingPhotos}
          />
        </Animated.View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      <FloatingNextButton
        onPress={handleNext}
        label="Continue to Review"
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
