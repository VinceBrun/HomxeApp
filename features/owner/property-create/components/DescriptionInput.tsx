import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface DescriptionInputProps {
  description: string;
  setDescription: (text: string) => void;
}

export default function DescriptionInput({
  description,
  setDescription,
}: DescriptionInputProps) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={[styles.inputCard, { backgroundColor: cardBg }]}>
      <View style={styles.inputHeader}>
        <Ionicons name="document-text-outline" size={20} color={tertiary} />
        <Text style={[styles.inputLabel, { color: textColor }]}>
          Description
        </Text>
        <View style={styles.requiredBadge}>
          <Text style={styles.requiredText}>Required</Text>
        </View>
      </View>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
          { color: textColor, backgroundColor: background },
        ]}
        placeholder="Describe your property, highlight unique features, nearby amenities, and what makes it special..."
        placeholderTextColor={mutedColor}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={6}
        maxLength={500}
      />

      <View style={styles.inputFooter}>
        <View style={styles.hintContainer}>
          <Ionicons name="bulb-outline" size={14} color={tertiary} />
          <Text style={[styles.inputHint, { color: mutedColor }]}>
            Detailed descriptions get 3x more inquiries
          </Text>
        </View>
        <Text
          style={[
            styles.charCounter,
            { color: description.length >= 50 ? primary : mutedColor },
          ]}
        >
          {description.length}/500
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  inputLabel: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemiBold",
    marginLeft: Spacing.xxs,
    flex: 1,
  },
  requiredBadge: {
    backgroundColor: "#CB5A48",
    paddingHorizontal: Spacing.xxs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  requiredText: {
    fontSize: 10,
    color: "#fff",
    fontFamily: "PoppinsMedium",
  },
  input: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsRegular",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  textArea: { minHeight: 120, textAlignVertical: "top" },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.xxs,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.xxxs,
  },
  inputHint: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
  charCounter: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsMedium",
  },
});
