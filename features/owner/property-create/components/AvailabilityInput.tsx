import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface AvailabilityInputProps {
  availableFrom: string;
  setAvailableFrom: (text: string) => void;
}

export default function AvailabilityInput({
  availableFrom,
  setAvailableFrom,
}: AvailabilityInputProps) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View style={[styles.inputCard, { backgroundColor: cardBg }]}>
      <View style={styles.inputHeader}>
        <Ionicons name="calendar-outline" size={20} color={tertiary} />
        <Text style={[styles.inputLabel, { color: textColor }]}>
          Available From
        </Text>
      </View>

      <TextInput
        style={[
          styles.input,
          { color: textColor, backgroundColor: background },
        ]}
        placeholder="e.g., Immediately / March 1, 2026"
        placeholderTextColor={mutedColor}
        value={availableFrom}
        onChangeText={setAvailableFrom}
      />

      <View style={styles.hintContainer}>
        <Ionicons
          name="information-circle-outline"
          size={14}
          color={tertiary}
        />
        <Text style={[styles.inputHint, { color: mutedColor }]}>
          Flexible dates attract more tenants
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
  input: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsRegular",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xxs,
    gap: Spacing.xxxs,
  },
  inputHint: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
});
