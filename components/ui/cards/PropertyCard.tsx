/**
 * PropertyCard - Displays property info in different layouts
 * Variants: default, list, featured, compact, explore
 */

import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// Property data structure
export interface PropertyCardData {
  id: string;
  image?: string | null;
  images?: string[] | null;
  name?: string | null;
  title?: string | null;
  address?: string | null;
  location?: string | null;
  price?: number | null;
  rent?: string | null;
  rating?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  size?: number | null;
  type?: string | null;
}

interface PropertyCardProps {
  property: PropertyCardData;
  variant?: "default" | "list" | "featured" | "compact" | "explore";
  onPress: () => void;
  onFavorite?: () => void;
  isFavorited?: boolean;
  style?: ViewStyle;
}

const fallbackImage = "https://via.placeholder.com/192x280.png?text=No+Image";

export default function PropertyCard({
  property,
  variant = "default",
  onPress,
  onFavorite,
  isFavorited = false,
  style,
}: PropertyCardProps) {
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");
  const background = useThemeColor({}, "background");
  const outlineBorder = useThemeColor({}, "outlineBorder");

  const isDark = background === "#000000";
  const borderColor = isDark ? outlineBorder : "#E5E5E5";

  // Press animation
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Normalize data fields
  const imageUrl = property.image || property.images?.[0] || fallbackImage;
  const propertyName = property.name || property.title || "Property";
  const propertyLocation = property.address || property.location || "Location";
  const propertyPrice = property.price
    ? `₦${property.price.toLocaleString()}/mo`
    : property.rent || "Price not available";

  // Default variant: Grid card (280px height)
  const renderDefault = () => (
    <TouchableOpacity
      onPressIn={() => (scale.value = withSpring(0.97))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          { backgroundColor: cardBg, borderColor },
          style,
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={imageUrl}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          {onFavorite && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={onFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={24}
                color={isFavorited ? "#EF4444" : "#FFFFFF"}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {propertyName}
          </Text>
          <Text
            style={[styles.location, { color: mutedColor }]}
            numberOfLines={1}
          >
            {propertyLocation}
          </Text>
          <Text style={[styles.price, { color: primary }]}>
            {propertyPrice}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  // List variant: Horizontal card (128px height)
  const renderList = () => (
    <TouchableOpacity
      onPressIn={() => (scale.value = withSpring(0.98))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.listContainer,
          animatedStyle,
          { backgroundColor: cardBg, borderColor },
          style,
        ]}
      >
        <View style={styles.listImageWrapper}>
          <Image
            source={imageUrl}
            style={styles.listImage}
            contentFit="cover"
            transition={200}
          />
        </View>

        <View style={styles.listContent}>
          <Text
            style={[styles.listTitle, { color: textColor }]}
            numberOfLines={1}
          >
            {propertyName}
          </Text>
          <Text
            style={[styles.listLocation, { color: mutedColor }]}
            numberOfLines={1}
          >
            {propertyLocation}
          </Text>
          <Text style={[styles.listPrice, { color: primary }]}>
            {propertyPrice}
          </Text>
          {!!(property.bedrooms || property.bathrooms) && (
            <View style={styles.listFeatures}>
              {!!property.bedrooms && (
                <View style={styles.stat}>
                  <Ionicons name="bed-outline" size={14} color={mutedColor} />
                  <Text style={[styles.featureText, { color: mutedColor }]}>
                    {property.bedrooms} Bed
                  </Text>
                </View>
              )}
              {!!property.bathrooms && (
                <View style={[styles.stat, { marginLeft: Spacing.sm }]}>
                  <Ionicons name="water-outline" size={14} color={mutedColor} />
                  <Text style={[styles.featureText, { color: mutedColor }]}>
                    {property.bathrooms} Bath
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {onFavorite && (
          <TouchableOpacity
            style={styles.listFavoriteButton}
            onPress={onFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={24}
              color={isFavorited ? "#EF4444" : mutedColor}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
    </TouchableOpacity>
  );

  // Featured variant: Larger card for highlights
  const renderFeatured = () => (
    <TouchableOpacity
      onPressIn={() => (scale.value = withSpring(0.97))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.featuredContainer,
          animatedStyle,
          { backgroundColor: cardBg, borderColor },
          style,
        ]}
      >
        <View style={styles.featuredImageWrapper}>
          <Image
            source={imageUrl}
            style={styles.featuredImage}
            contentFit="cover"
            transition={200}
          />
          {onFavorite && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={onFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={24}
                color={isFavorited ? "#EF4444" : "#FFFFFF"}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.featuredContent}>
          <Text
            style={[styles.featuredTitle, { color: textColor }]}
            numberOfLines={1}
          >
            {propertyName}
          </Text>
          <Text
            style={[styles.featuredLocation, { color: mutedColor }]}
            numberOfLines={1}
          >
            {propertyLocation}
          </Text>
          <Text style={[styles.featuredPrice, { color: primary }]}>
            {propertyPrice}
          </Text>

          {!!(property.bedrooms || property.bathrooms) && (
            <View style={styles.featuredFeatures}>
              {!!property.bedrooms && (
                <View style={styles.stat}>
                  <Ionicons name="bed-outline" size={16} color={mutedColor} />
                  <Text
                    style={[styles.featuredFeatureText, { color: mutedColor }]}
                  >
                    {property.bedrooms} Bed
                  </Text>
                </View>
              )}
              {!!property.bathrooms && (
                <View style={[styles.stat, { marginLeft: Spacing.sm }]}>
                  <Ionicons name="water-outline" size={16} color={mutedColor} />
                  <Text
                    style={[styles.featuredFeatureText, { color: mutedColor }]}
                  >
                    {property.bathrooms} Bath
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  // Compact variant: Small card for recommendations
  const renderCompact = () => (
    <TouchableOpacity
      onPressIn={() => (scale.value = withSpring(0.98))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.compactContainer,
          animatedStyle,
          { backgroundColor: cardBg, borderColor },
          style,
        ]}
      >
        <View style={styles.compactImageWrapper}>
          <Image
            source={imageUrl}
            style={styles.compactImage}
            contentFit="cover"
            transition={200}
          />
        </View>

        <View style={styles.compactContent}>
          <Text
            style={[styles.compactTitle, { color: textColor }]}
            numberOfLines={1}
          >
            {propertyName}
          </Text>
          <Text
            style={[styles.compactLocation, { color: mutedColor }]}
            numberOfLines={1}
          >
            {propertyLocation}
          </Text>
          <Text style={[styles.compactPrice, { color: primary }]}>
            {propertyPrice}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  // Explore variant: Grid card with features
  const renderExplore = () => (
    <TouchableOpacity
      onPressIn={() => (scale.value = withSpring(0.97))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          { backgroundColor: cardBg, borderColor },
          style,
        ]}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={imageUrl}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          {onFavorite && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={onFavorite}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={24}
                color={isFavorited ? "#EF4444" : "#FFFFFF"}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {propertyName}
          </Text>
          <Text
            style={[styles.location, { color: mutedColor }]}
            numberOfLines={1}
          >
            {propertyLocation}
          </Text>
          <Text style={[styles.price, { color: primary }]}>
            {propertyPrice}
          </Text>

          {!!(property.bedrooms || property.bathrooms) && (
            <View style={styles.listFeatures}>
              {!!property.bedrooms && (
                <View style={styles.stat}>
                  <Ionicons name="bed-outline" size={14} color={mutedColor} />
                  <Text style={[styles.featureText, { color: mutedColor }]}>
                    {property.bedrooms} Bed
                  </Text>
                </View>
              )}
              {!!property.bathrooms && (
                <View style={[styles.stat, { marginLeft: Spacing.sm }]}>
                  <Ionicons name="water-outline" size={14} color={mutedColor} />
                  <Text style={[styles.featureText, { color: mutedColor }]}>
                    {property.bathrooms} Bath
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  // Render based on variant
  switch (variant) {
    case "list":
      return renderList();
    case "featured":
      return renderFeatured();
    case "compact":
      return renderCompact();
    case "explore":
      return renderExplore();
    default:
      return renderDefault();
  }
}

const styles = StyleSheet.create({
  // Default variant
  container: {
    borderRadius: Radius.md,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageWrapper: {
    width: "100%",
    height: 280,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
    marginBottom: Spacing.xxxs,
  },
  location: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },

  // List variant
  listContainer: {
    flexDirection: "row",
    borderRadius: Radius.md,
    overflow: "hidden",
    borderWidth: 1,
    height: 128,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  listImageWrapper: {
    width: 128,
    height: "100%",
  },
  listImage: {
    width: "100%",
    height: "100%",
  },
  listContent: {
    flex: 1,
    padding: Spacing.sm,
    justifyContent: "space-between",
  },
  listTitle: {
    fontSize: 15,
    fontFamily: "PoppinsSemibold",
  },
  listLocation: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
  },
  listPrice: {
    fontSize: 14,
    fontFamily: "PoppinsBold",
  },
  listFeatures: {
    flexDirection: "row",
    marginTop: Spacing.xs,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featureText: {
    fontSize: 11,
    fontFamily: "PoppinsRegular",
  },
  listFavoriteButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  // Featured variant
  featuredContainer: {
    borderRadius: Radius.md,
    overflow: "hidden",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  featuredImageWrapper: {
    width: "100%",
    height: 280,
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredContent: {
    padding: Spacing.lg,
  },
  featuredTitle: {
    fontSize: 18,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.xxs,
  },
  featuredLocation: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    marginBottom: Spacing.sm,
  },
  featuredPrice: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.sm,
  },
  featuredFeatures: {
    flexDirection: "row",
    marginTop: Spacing.xs,
  },
  featuredFeatureText: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
  },

  // Compact variant
  compactContainer: {
    borderRadius: Radius.md,
    overflow: "hidden",
    borderWidth: 1,
    width: 180,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  compactImageWrapper: {
    width: "100%",
    height: 160,
  },
  compactImage: {
    width: "100%",
    height: "100%",
  },
  compactContent: {
    padding: Spacing.sm,
    paddingBottom: Spacing.lg,
    height: 90,
    justifyContent: "space-between",
  },
  compactTitle: {
    fontSize: 13,
    fontFamily: "PoppinsSemibold",
  },
  compactLocation: {
    fontSize: 11,
    fontFamily: "PoppinsRegular",
  },
  compactPrice: {
    fontSize: 13,
    fontFamily: "PoppinsBold",
  },
});
