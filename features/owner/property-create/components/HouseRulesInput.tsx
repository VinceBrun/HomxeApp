import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface HouseRulesInputProps {
  houseRules: string[];
  updateHouseRule: (index: number, value: string) => void;
}

export default function HouseRulesInput({
  houseRules,
  updateHouseRule,
}: HouseRulesInputProps) {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <>
      {houseRules.map((rule, index) => (
        <View
          key={index}
          style={[styles.inputCard, { backgroundColor: cardBg }]}
        >
          <View style={styles.inputHeader}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={tertiary}
            />
            <Text style={[styles.inputLabel, { color: textColor }]}>
              Rule {index + 1}
            </Text>
          </View>

          <TextInput
            style={[
              styles.input,
              { color: textColor, backgroundColor: background },
            ]}
            placeholder={
              index === 0
                ? "e.g., No smoking"
                : index === 1
                  ? "e.g., No pets"
                  : "e.g., Quiet hours after 10 PM"
            }
            placeholderTextColor={mutedColor}
            value={rule}
            onChangeText={(text) => updateHouseRule(index, text)}
            maxLength={100}
          />
        </View>
      ))}
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
  input: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsRegular",
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
});
