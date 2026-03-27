import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PricingInputCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  placeholder?: string;
}

export default function PricingInputCard({
  icon,
  label,
  value,
  onChangeText,
  required = false,
  placeholder = "0",
}: PricingInputCardProps) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <View style={[styles.inputCard, { backgroundColor: cardBg }]}>
      <View style={styles.inputHeader}>
        <Ionicons name={icon} size={20} color={tertiary} />
        <Text style={[styles.inputLabel, { color: textColor }]}>{label}</Text>
        {required ? (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>Required</Text>
          </View>
        ) : (
          <Text style={[styles.optionalText, { color: mutedColor }]}>
            Optional
          </Text>
        )}
      </View>

      <View style={styles.priceInputContainer}>
        <View style={[styles.currencyBadge, { backgroundColor: tertiary }]}>
          <Text style={styles.currencyText}>₦</Text>
        </View>
        <TextInput
          style={[
            styles.input,
            styles.priceInput,
            { color: textColor, backgroundColor: background },
          ]}
          placeholder={placeholder}
          placeholderTextColor={mutedColor}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
        />
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
  optionalText: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
  },
  input: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsRegular",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    marginRight: Spacing.xs,
  },
  currencyText: {
    color: "#fff",
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
  },
  priceInput: {
    flex: 1,
  },
});
