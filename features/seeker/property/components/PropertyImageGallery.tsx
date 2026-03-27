import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.45;

interface PropertyImageGalleryProps {
  images: string[];
  scrollY: Animated.Value;
  onBack: () => void;
  onShare: () => void;
  onToggleSave: () => void;
  isSaved: boolean;
}

export default function PropertyImageGallery({
  images,
  scrollY,
  onBack,
  onShare,
  onToggleSave,
  isSaved,
}: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const textColor = useThemeColor({}, "text");

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.imageContainer,
        { transform: [{ scale: imageScale }] },
      ]}
    >
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          setCurrentImageIndex(index);
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        )}
        keyExtractor={(_item, index) => `image-${index}`}
      />

      {/* Image Counter */}
      <View style={styles.imageCounter}>
        <Text style={styles.imageCounterText}>
          {currentImageIndex + 1} / {images.length}
        </Text>
      </View>

      {/* Back & Actions - Floating */}
      <SafeAreaView edges={["top"]} style={styles.floatingActions}>
        <TouchableOpacity onPress={onBack} style={styles.floatingButton}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>

        <View style={styles.floatingRightActions}>
          <TouchableOpacity onPress={onShare} style={styles.floatingButton}>
            <Ionicons name="share-outline" size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onToggleSave} style={styles.floatingButton}>
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={24}
              color={isSaved ? "#ff4444" : textColor}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    height: IMAGE_HEIGHT,
    overflow: "hidden",
  },
  propertyImage: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  imageCounter: {
    position: "absolute",
    bottom: Spacing.md,
    right: Spacing.md,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xxxs,
    borderRadius: Radius.sm,
  },
  imageCounterText: {
    color: "#fff",
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsMedium",
  },
  floatingActions: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
  },
  floatingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingRightActions: {
    flexDirection: "row",
    gap: Spacing.xxs,
  },
});
