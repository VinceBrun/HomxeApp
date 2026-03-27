import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface VisibilitySelectorProps {
  visibility: "public" | "private";
  setVisibility: (value: "public" | "private") => void;
}

export default function VisibilitySelector({
  visibility,
  setVisibility,
}: VisibilitySelectorProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <>
      <TouchableOpacity
        style={[
          styles.visibilityCard,
          {
            backgroundColor: visibility === "public" ? `${primary}15` : cardBg,
            borderColor: visibility === "public" ? primary : "rgba(0,0,0,0.08)",
          },
        ]}
        onPress={() => setVisibility("public")}
      >
        <View style={styles.radioContainer}>
          <View
            style={[
              styles.radio,
              {
                borderColor: visibility === "public" ? primary : mutedColor,
              },
            ]}
          >
            {visibility === "public" && (
              <View style={[styles.radioInner, { backgroundColor: primary }]} />
            )}
          </View>
          <View style={styles.radioContent}>
            <Text style={[styles.radioTitle, { color: textColor }]}>
              Public
            </Text>
            <Text style={[styles.radioSubtitle, { color: mutedColor }]}>
              Visible to all users
            </Text>
          </View>
        </View>
        <Ionicons
          name="globe-outline"
          size={24}
          color={visibility === "public" ? primary : mutedColor}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.visibilityCard,
          {
            backgroundColor: visibility === "private" ? `${primary}15` : cardBg,
            borderColor:
              visibility === "private" ? primary : "rgba(0,0,0,0.08)",
          },
        ]}
        onPress={() => setVisibility("private")}
      >
        <View style={styles.radioContainer}>
          <View
            style={[
              styles.radio,
              {
                borderColor: visibility === "private" ? primary : mutedColor,
              },
            ]}
          >
            {visibility === "private" && (
              <View style={[styles.radioInner, { backgroundColor: primary }]} />
            )}
          </View>
          <View style={styles.radioContent}>
            <Text style={[styles.radioTitle, { color: textColor }]}>
              Private
            </Text>
            <Text style={[styles.radioSubtitle, { color: mutedColor }]}>
              Only via direct link
            </Text>
          </View>
        </View>
        <Ionicons
          name="lock-closed-outline"
          size={24}
          color={visibility === "private" ? primary : mutedColor}
        />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  visibilityCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    marginBottom: Spacing.xs,
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.xs,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  radioContent: {
    flex: 1,
  },
  radioTitle: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemiBold",
  },
  radioSubtitle: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
  },
});
