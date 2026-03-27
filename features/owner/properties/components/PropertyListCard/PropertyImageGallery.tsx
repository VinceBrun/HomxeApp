import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PropertyStatus } from "@/types";

interface PropertyImageGalleryProps {
  images: string[];
  status: PropertyStatus;
  statusConfig: { label: string; color: string };
}

export default function PropertyImageGallery({
  images,
  statusConfig,
}: PropertyImageGalleryProps) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");

  const previewImages = images.slice(1, 4);
  const remainingCount = images.length > 4 ? images.length - 4 : 0;

  return (
    <>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: images[0] || "https://via.placeholder.com/150",
          }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <View
          style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}
        >
          <Text style={styles.statusText}>{statusConfig.label}</Text>
        </View>
      </View>

      {previewImages.length > 0 && (
        <View style={styles.thumbnailsRow}>
          {previewImages.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ))}
          {remainingCount > 0 && (
            <View
              style={[
                styles.moreImages,
                { backgroundColor: `${mutedColor}30` },
              ]}
            >
              <Text style={[styles.moreImagesText, { color: textColor }]}>
                +{remainingCount}
              </Text>
            </View>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E5E5",
  },
  statusBadge: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "PoppinsSemibold",
  },
  thumbnailsRow: {
    flexDirection: "row",
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: Radius.xs,
    backgroundColor: "#E5E5E5",
  },
  moreImages: {
    width: 70,
    height: 70,
    borderRadius: Radius.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  moreImagesText: {
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
  },
});
