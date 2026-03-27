import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface BasicInfoFormProps {
  propertyName: string;
  setPropertyName: (text: string) => void;
  address: string;
  setAddress: (text: string) => void;
}

export default function BasicInfoForm({
  propertyName,
  setPropertyName,
  address,
  setAddress,
}: BasicInfoFormProps) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  return (
    <>
      <View style={[styles.inputCard, { backgroundColor: cardBg }]}>
        <View style={styles.inputHeader}>
          <Ionicons name="pricetag-outline" size={20} color={tertiary} />
          <Text style={[styles.inputLabel, { color: textColor }]}>
            Property Name
          </Text>
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>Required</Text>
          </View>
        </View>

        <TextInput
          style={[
            styles.input,
            { color: textColor, backgroundColor: background },
          ]}
          placeholder="e.g., Modern 3BR in Victoria Island"
          placeholderTextColor={mutedColor}
          value={propertyName}
          onChangeText={setPropertyName}
          maxLength={60}
        />

        <View style={styles.inputFooter}>
          <View style={styles.hintContainer}>
            <Ionicons name="bulb-outline" size={14} color={tertiary} />
            <Text style={[styles.inputHint, { color: mutedColor }]}>
              Include key features to attract tenants
            </Text>
          </View>
          <Text style={[styles.charCounter, { color: mutedColor }]}>
            {propertyName.length}/60
          </Text>
        </View>
      </View>

      <View style={[styles.inputCard, { backgroundColor: cardBg }]}>
        <View style={styles.inputHeader}>
          <Ionicons name="location-outline" size={20} color={tertiary} />
          <Text style={[styles.inputLabel, { color: textColor }]}>
            Full Address
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
          placeholder="Enter complete address with landmarks"
          placeholderTextColor={mutedColor}
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity style={styles.mapButton}>
          <Ionicons name="map" size={18} color={primary} />
          <Text style={[styles.mapButtonText, { color: primary }]}>
            Select on Map
          </Text>
        </TouchableOpacity>
      </View>
    </>
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
  textArea: { minHeight: 80, textAlignVertical: "top" },
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
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: Spacing.xxs,
  },
  mapButtonText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
    marginLeft: Spacing.xxxs,
  },
});
