import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PropertyDescriptionProps {
  description: string | null;
}

export default function PropertyDescription({ description }: PropertyDescriptionProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        About This Property
      </Text>

      <Text
        style={[styles.descriptionText, { color: mutedColor }]}
        numberOfLines={showFullDescription ? undefined : 4}
      >
        {description || "No description available"}
      </Text>

      {description && description.length > 200 && (
        <TouchableOpacity
          onPress={() => setShowFullDescription(!showFullDescription)}
        >
          <Text style={[styles.readMoreText, { color: primary }]}>
            {showFullDescription ? "Show less" : "Read more"}
          </Text>
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
  descriptionText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    lineHeight: 24,
  },
  readMoreText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
    marginTop: Spacing.xxs,
  },
});
