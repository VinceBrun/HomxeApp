import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

/**
 * BASE CARD COMPONENT
 * Universal card wrapper with consistent theming
 *
 * Usage:
 * <BaseCard variant="elevated" onPress={handlePress}>
 *   {children}
 * </BaseCard>
 */

interface BaseCardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function BaseCard({
  children,
  variant = "default",
  onPress,
  style,
  disabled = false,
}: BaseCardProps) {
  const cardBg = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "outlineBorder");
  const background = useThemeColor({}, "background");

  // Determine if theme is dark
  const isDark = background === "#000000";
  const finalBorderColor = isDark ? borderColor : "#E5E5E5";

  // Variant styles
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "elevated":
        return {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        };
      case "outlined":
        return {
          borderWidth: 1,
          borderColor: finalBorderColor,
        };
      case "default":
      default:
        return {};
    }
  };

  const variantStyles = getVariantStyles();

  // Use TouchableOpacity if onPress provided, otherwise View
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[
        styles.container,
        { backgroundColor: cardBg },
        variantStyles,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    padding: Spacing.md,
    overflow: "hidden",
  },
});
