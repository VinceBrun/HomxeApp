import React from "react";
import { Text, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface FloatingNextButtonProps {
  onPress: () => void;
  label: string;
  visible: boolean;
  fadeAnim: Animated.Value;
}

export default function FloatingNextButton({
  onPress,
  label,
  visible,
  fadeAnim,
}: FloatingNextButtonProps) {
  const primary = useThemeColor({}, "primary");

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.floatingButtonContainer, { opacity: fadeAnim }]}
    >
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[primary, primary]}
          style={styles.floatingButtonGradient}
        >
          <Text style={styles.floatingButtonText}>{label}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: "absolute",
    bottom: Spacing.md,
    left: Spacing.md,
    right: Spacing.md,
  },
  floatingButton: {
    borderRadius: Radius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  floatingButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xxs,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
  },
});
