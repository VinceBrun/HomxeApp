import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PropertyTypeGridProps {
  propertyTypes: Array<{
    id: string;
    label: string;
    icon: string;
    gradient: string[];
  }>;
  selectedType: string;
  onSelect: (id: string) => void;
}

export default function PropertyTypeGrid({
  propertyTypes,
  selectedType,
  onSelect,
}: PropertyTypeGridProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");

  return (
    <View style={styles.propertyTypeGrid}>
      {propertyTypes.map((type) => {
        const isSelected = selectedType === type.id;

        return (
          <TouchableOpacity
            key={type.id}
            onPress={() => onSelect(type.id)}
            activeOpacity={0.8}
            style={styles.propertyTypeCardWrapper}
          >
            <View
              style={[
                styles.propertyTypeCard,
                {
                  backgroundColor: cardBg,
                  borderColor: isSelected ? "transparent" : "rgba(0,0,0,0.08)",
                },
              ]}
            >
              {isSelected && (
                <LinearGradient
                  colors={type.gradient as [string, string]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              )}

              <Ionicons
                name={type.icon as any}
                size={32}
                color={isSelected ? "#fff" : textColor}
                style={{ marginBottom: Spacing.xxs }}
              />

              <Text
                style={[
                  styles.propertyTypeLabel,
                  { color: isSelected ? "#fff" : textColor },
                ]}
              >
                {type.label}
              </Text>

              {isSelected && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                </View>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  propertyTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -Spacing.xxxs,
  },
  propertyTypeCardWrapper: { width: "33.33%", padding: Spacing.xxxs },
  propertyTypeCard: {
    aspectRatio: 1,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  propertyTypeLabel: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsSemiBold",
    textAlign: "center",
  },
  checkmarkContainer: {
    position: "absolute",
    top: Spacing.xxs,
    right: Spacing.xxs,
  },
});
