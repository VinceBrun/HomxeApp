/**
 * Unified Button Component
 * Highly configurable button supporting multiple variants, sizes, and loading states.
 */

import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ButtonProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Button: React.FC<ButtonProps> = ({
  // --- Modern Props ---
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  onPress,
  children,
  style,

  // --- Legacy Props (Backward compatibility) ---
  title,
  handlePress,
  isLoading,

  ...props
}) => {
  const primary = useThemeColor({}, "primary");
  const text = useThemeColor({}, "text");
  const buttonText = useThemeColor({}, "buttonText");
  const dangerColor = "#EF4444";
  const successColor = "#10B981";

  // Normalize modern and legacy props
  const buttonIsLoading = loading || isLoading;
  const buttonTextContent = children || title;
  const handleButtonPress = onPress || handlePress;
  const isDisabled = disabled || buttonIsLoading;

  // Compute styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "primary": return { backgroundColor: primary, borderWidth: 0, textColor: buttonText };
      case "secondary": return { backgroundColor: `${primary}15`, borderWidth: 0, textColor: primary };
      case "outline": return { backgroundColor: "transparent", borderWidth: 1.5, borderColor: primary, textColor: text };
      case "ghost": return { backgroundColor: "transparent", borderWidth: 0, textColor: primary };
      case "danger": return { backgroundColor: dangerColor, borderWidth: 0, textColor: "#FFFFFF" };
      case "success": return { backgroundColor: successColor, borderWidth: 0, textColor: "#FFFFFF" };
      default:
        return {
          backgroundColor: primary,
          borderWidth: 0,
          textColor: buttonText,
        };
    }
  };

  // Size styles
  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          minHeight: 36,
          paddingHorizontal: Spacing.md,
          fontSize: Typography.fontSize.h5,
        };
      case "large":
        return {
          minHeight: 56,
          paddingHorizontal: Spacing.xl,
          fontSize: Typography.fontSize.h2,
        };
      case "medium":
      default:
        return {
          minHeight: 48,
          paddingHorizontal: Spacing.lg,
          fontSize: Typography.fontSize.h3,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={handleButtonPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: variantStyles.backgroundColor,
          borderWidth: variantStyles.borderWidth,
          borderColor: variantStyles.borderColor,
          minHeight: sizeStyles.minHeight,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          opacity: isDisabled ? 0.5 : 1,
          width: fullWidth ? "100%" : "auto",
        },
        style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {/* Icon Left */}
      {icon && iconPosition === "left" && !buttonIsLoading && (
        <View style={styles.iconLeft}>
          <Ionicons
            name={icon}
            size={sizeStyles.fontSize + 2}
            color={variantStyles.textColor}
          />
        </View>
      )}

      {/* Loading Spinner Left */}
      {buttonIsLoading && iconPosition === "left" && (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
          style={styles.iconLeft}
        />
      )}

      {/* Button Text */}
      {typeof buttonTextContent === "string" ? (
        <Text
          style={[
            styles.text,
            {
              color: variantStyles.textColor,
              fontSize: sizeStyles.fontSize,
            },
          ]}
        >
          {buttonTextContent}
        </Text>
      ) : (
        buttonTextContent
      )}

      {/* Icon Right */}
      {icon && iconPosition === "right" && !buttonIsLoading && (
        <View style={styles.iconRight}>
          <Ionicons
            name={icon}
            size={sizeStyles.fontSize + 2}
            color={variantStyles.textColor}
          />
        </View>
      )}

      {/* Loading Spinner Right */}
      {buttonIsLoading && iconPosition === "right" && (
        <ActivityIndicator
          size="small"
          color={variantStyles.textColor}
          style={styles.iconRight}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontFamily: "PoppinsSemiBold",
    textAlign: "center",
  },
  iconLeft: {
    marginRight: Spacing.xs,
  },
  iconRight: {
    marginLeft: Spacing.xs,
  },
});

export default Button;
