import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

const { width } = Dimensions.get("window");
const PHOTO_SIZE = (width - Spacing.lg * 2 - Spacing.sm) / 2;

interface PhotoGridProps {
  photos: string[];
  coverPhotoIndex: number;
  onRemove: (index: number) => void;
  onSetCover: (index: number) => void;
  onAdd: () => void;
  remainingPhotos: number;
}

export default function PhotoGrid({
  photos,
  coverPhotoIndex,
  onRemove,
  onSetCover,
  onAdd,
  remainingPhotos,
}: PhotoGridProps) {
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View style={styles.gridContainer}>
      {photos.map((photo, index) => (
        <View key={index} style={styles.photoWrapper}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onSetCover(index)}
            style={styles.photoTouchable}
          >
            <Image source={{ uri: photo }} style={styles.photo} />
            {index === coverPhotoIndex && (
              <View style={[styles.coverBadge, { backgroundColor: primary }]}>
                <Text style={styles.coverText}>Cover Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => onRemove(index)}
          >
            <Ionicons name="close-circle" size={24} color="#FF4444" />
          </TouchableOpacity>
        </View>
      ))}

      {remainingPhotos > 0 && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: cardBg, borderColor: mutedColor }]}
          onPress={onAdd}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-outline" size={32} color={primary} />
          <Text style={[styles.addButtonText, { color: primary }]}>Add Photos</Text>
          <Text style={[styles.limitText, { color: mutedColor }]}>
            {remainingPhotos} remaining
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  photoWrapper: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: Radius.md,
    overflow: "hidden",
    position: "relative",
  },
  photoTouchable: {
    flex: 1,
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 4,
    alignItems: "center",
  },
  coverText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "PoppinsBold",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  addButton: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  addButtonText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
  },
  limitText: {
    fontSize: 10,
    fontFamily: "PoppinsRegular",
  },
});
