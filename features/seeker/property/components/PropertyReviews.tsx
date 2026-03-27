import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ReviewWithTenant } from "../types/propertyDetails.types";

interface PropertyReviewsProps {
  reviews: ReviewWithTenant[];
  averageRating: string;
}

export default function PropertyReviews({ reviews, averageRating }: PropertyReviewsProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");

  if (reviews.length === 0) return null;

  return (
    <View style={styles.section}>
      <View style={styles.reviewsHeader}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Reviews
        </Text>
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={16} color={tertiary} />
          <Text style={[styles.ratingValue, { color: textColor }]}>
            {averageRating}
          </Text>
          <Text style={[styles.ratingCount, { color: mutedColor }]}>
            ({reviews.length})
          </Text>
        </View>
      </View>

      {reviews.slice(0, 3).map((review) => (
        <View
          key={review.id}
          style={[styles.reviewCard, { backgroundColor: cardBg }]}
        >
          <View style={styles.reviewHeader}>
            <View
              style={[
                styles.reviewerAvatar,
                { backgroundColor: `${tertiary}20` },
              ]}
            >
              <Text style={[styles.reviewerInitial, { color: tertiary }]}>
                {review.tenant?.full_name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>

            <View style={styles.reviewerInfo}>
              <Text style={[styles.reviewerName, { color: textColor }]}>
                {review.tenant?.full_name || "Anonymous"}
              </Text>
              <View style={styles.reviewStars}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < review.rating ? "star" : "star-outline"}
                    size={14}
                    color={tertiary}
                  />
                ))}
              </View>
            </View>

            <Text style={[styles.reviewDate, { color: mutedColor }]}>
              {new Date(review.created_at).toLocaleDateString()}
            </Text>
          </View>

          <Text style={[styles.reviewComment, { color: mutedColor }]}>
            {review.comment}
          </Text>
        </View>
      ))}

      {reviews.length > 3 && (
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={[styles.viewAllText, { color: primary }]}>
            View all {reviews.length} reviews
          </Text>
          <Ionicons name="chevron-forward" size={16} color={primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.sm,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxxs,
  },
  ratingValue: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
  },
  ratingCount: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
  },
  reviewCard: {
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.xs,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xxs,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewerInitial: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
  },
  reviewerInfo: {
    marginLeft: Spacing.xs,
    flex: 1,
  },
  reviewerName: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
  },
  reviewStars: {
    flexDirection: "row",
    gap: 2,
    marginTop: 2,
  },
  reviewDate: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
  },
  reviewComment: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    lineHeight: 20,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.xs,
    gap: Spacing.xxxs,
  },
  viewAllText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
  },
});
