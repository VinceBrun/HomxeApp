import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

/**
 * UNIFIED ACTION CARD COMPONENT
 * Consolidates: CategoryCard, OptionCard, PersonaCard, profile/options/OptionCard
 *
 * Variants:
 * - category: Simple category selection (chip-style)
 * - option: Option with icon and description
 * - persona: Large persona selection card
 *
 * Usage:
 * <ActionCard
 *   variant="option"
 *   icon="person"
 *   title="Profile"
 *   description="Edit your profile"
 *   selected={isSelected}
 *   onPress={handlePress}
 * />
 */

interface ActionCardProps {
  variant?: "category" | "option" | "persona";
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  description?: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function ActionCard({
  variant = "option",
  icon,
  title,
  subtitle,
  description,
  selected = false,
  onPress,
  style,
  disabled = false,
}: ActionCardProps) {
  const primary = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "card");
  //   const background = useThemeColor({}, "background");

  // Category variant (chip/pill style)
  const renderCategory = () => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.categoryContainer,
        {
          backgroundColor: selected ? primary : cardBg,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.categoryText,
          {
            color: selected ? "#FFFFFF" : textColor,
            fontFamily: selected ? "PoppinsBold" : "PoppinsMedium",
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Option variant (with icon and description)
  const renderOption = () => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        styles.optionContainer,
        {
          backgroundColor: cardBg,
          borderWidth: selected ? 1.5 : 0,
          borderColor: selected ? primary : "transparent",
        },
        style,
      ]}
    >
      {icon && (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: selected ? `${primary}15` : `${mutedColor}10`,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={24}
            color={selected ? primary : mutedColor}
          />
        </View>
      )}
      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionTitle,
            {
              color: selected ? primary : textColor,
            },
          ]}
        >
          {title}
        </Text>
        {(description || subtitle) && (
          <Text style={[styles.optionDescription, { color: mutedColor }]}>
            {description || subtitle}
          </Text>
        )}
      </View>
      {selected && (
        <Ionicons name="checkmark-circle" size={24} color={primary} />
      )}
    </TouchableOpacity>
  );

  // Persona variant (large selection card)
  const renderPersona = () => (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.personaContainer,
        {
          backgroundColor: cardBg,
          borderWidth: selected ? 1.5 : 0,
          borderColor: selected ? primary : "transparent",
        },
        style,
      ]}
    >
      {icon && (
        <View
          style={[
            styles.personaIconContainer,
            {
              backgroundColor: selected ? `${primary}15` : `${mutedColor}10`,
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={32}
            color={selected ? primary : mutedColor}
          />
        </View>
      )}
      <View style={styles.personaContent}>
        <Text
          style={[
            styles.personaTitle,
            {
              color: selected ? primary : textColor,
            },
          ]}
        >
          {title}
        </Text>
        {(subtitle || description) && (
          <Text
            style={[
              styles.personaSubtitle,
              {
                color: selected ? primary : mutedColor,
              },
            ]}
          >
            {subtitle || description}
          </Text>
        )}
      </View>
      {selected && (
        <View style={styles.personaCheckmark}>
          <Ionicons name="checkmark-circle" size={28} color={primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  // Render based on variant
  switch (variant) {
    case "category":
      return renderCategory();
    case "persona":
      return renderPersona();
    case "option":
    default:
      return renderOption();
  }
}

const styles = StyleSheet.create({
  // CATEGORY VARIANT (Chip/Pill)
  categoryContainer: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontSize: 14,
  },

  // OPTION VARIANT
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: "PoppinsSemibold",
  },
  optionDescription: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    marginTop: 2,
  },

  // PERSONA VARIANT (Large Selection Card)
  personaContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  personaIconContainer: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  personaContent: {
    flex: 1,
  },
  personaTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
  },
  personaSubtitle: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    marginTop: Spacing.xxs,
  },
  personaCheckmark: {
    marginLeft: Spacing.sm,
  },
});
