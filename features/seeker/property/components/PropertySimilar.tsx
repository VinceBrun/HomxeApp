import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Property } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface PropertySimilarProps {
  similarProperties: Property[];
}

export default function PropertySimilar({
  similarProperties,
}: PropertySimilarProps) {
  const router = useRouter();
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const mutedColor = useThemeColor({}, "icon");

  if (similarProperties.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Similar Properties
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {similarProperties.map((similar) => (
          <TouchableOpacity
            key={similar.id}
            style={[styles.card, { backgroundColor: cardBg }]}
            onPress={() => router.push(`/(seeker)/property/${similar.id}`)}
          >
            <Image
              source={{
                uri:
                  similar.images?.[0] || "https://via.placeholder.com/200x150",
              }}
              style={styles.image}
            />

            <View style={styles.info}>
              <Text
                style={[styles.title, { color: textColor }]}
                numberOfLines={1}
              >
                {similar.title}
              </Text>
              <Text
                style={[styles.location, { color: mutedColor }]}
                numberOfLines={1}
              >
                {similar.location}
              </Text>
              <Text style={[styles.price, { color: primary }]}>
                ₦{similar.price?.toLocaleString()}/mo
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
    // Break out of the parent contentContainer's paddingHorizontal (Spacing.lg = 24)
    marginHorizontal: -Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.sm,
    // Re-apply padding only to the title so it stays visually aligned
    paddingHorizontal: Spacing.lg,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  card: {
    width: 200,
    borderRadius: Radius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 120,
  },
  info: {
    padding: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsSemiBold",
  },
  location: {
    fontSize: 10,
    fontFamily: "PoppinsRegular",
    marginTop: 2,
  },
  price: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsBold",
    marginTop: Spacing.xxxs,
  },
});
