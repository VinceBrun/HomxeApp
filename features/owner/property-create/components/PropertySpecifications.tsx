import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PropertySpecificationsProps {
  bedrooms: number;
  setBedrooms: (val: number) => void;
  bathrooms: number;
  setBathrooms: (val: number) => void;
  size: string;
  setSize: (text: string) => void;
}

export default function PropertySpecifications({
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  size,
  setSize,
}: PropertySpecificationsProps) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  return (
    <>
      <View style={styles.specsRow}>
        <View style={[styles.specCard, { backgroundColor: cardBg }]}>
          <Ionicons name="bed-outline" size={24} color={tertiary} />
          <Text style={[styles.specLabel, { color: textColor }]}>Bedrooms</Text>

          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[
                styles.counterButton,
                { backgroundColor: `${primary}15` },
              ]}
              onPress={() => bedrooms > 1 && setBedrooms(bedrooms - 1)}
            >
              <Ionicons name="remove" size={20} color={primary} />
            </TouchableOpacity>

            <Text style={[styles.counterValue, { color: textColor }]}>
              {bedrooms}
            </Text>

            <TouchableOpacity
              style={[
                styles.counterButton,
                { backgroundColor: `${primary}15` },
              ]}
              onPress={() => bedrooms < 10 && setBedrooms(bedrooms + 1)}
            >
              <Ionicons name="add" size={20} color={primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.specCard, { backgroundColor: cardBg }]}>
          <Ionicons name="water-outline" size={24} color={tertiary} />
          <Text style={[styles.specLabel, { color: textColor }]}>
            Bathrooms
          </Text>

          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[
                styles.counterButton,
                { backgroundColor: `${primary}15` },
              ]}
              onPress={() => bathrooms > 1 && setBathrooms(bathrooms - 1)}
            >
              <Ionicons name="remove" size={20} color={primary} />
            </TouchableOpacity>

            <Text style={[styles.counterValue, { color: textColor }]}>
              {bathrooms}
            </Text>

            <TouchableOpacity
              style={[
                styles.counterButton,
                { backgroundColor: `${primary}15` },
              ]}
              onPress={() => bathrooms < 10 && setBathrooms(bathrooms + 1)}
            >
              <Ionicons name="add" size={20} color={primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[styles.inputCard, { backgroundColor: cardBg }]}>
        <View style={styles.inputHeader}>
          <Ionicons name="expand-outline" size={20} color={tertiary} />
          <Text style={[styles.inputLabel, { color: textColor }]}>
            Property Size
          </Text>
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>Required</Text>
          </View>
        </View>

        <View style={styles.sizeInputContainer}>
          <TextInput
            style={[
              styles.input,
              styles.sizeInput,
              { color: textColor, backgroundColor: background },
            ]}
            placeholder="150"
            placeholderTextColor={mutedColor}
            value={size}
            onChangeText={setSize}
            keyboardType="numeric"
          />
          <View style={[styles.unitBadge, { backgroundColor: tertiary }]}>
            <Text style={styles.unitText}>m²</Text>
          </View>
        </View>

        <View style={styles.hintContainer}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={tertiary}
          />
          <Text style={[styles.inputHint, { color: mutedColor }]}>
            Accurate size helps tenants filter properties
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  specsRow: { flexDirection: "row", gap: Spacing.xs },
  specCard: {
    flex: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  specLabel: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
    marginTop: Spacing.xxs,
    marginBottom: Spacing.xs,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  counterValue: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    minWidth: 32,
    textAlign: "center",
  },
  inputCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginTop: Spacing.md,
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
  sizeInputContainer: { flexDirection: "row", alignItems: "center" },
  input: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsRegular",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  sizeInput: { flex: 1 },
  unitBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    marginLeft: Spacing.xs,
  },
  unitText: {
    color: "#fff",
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
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
