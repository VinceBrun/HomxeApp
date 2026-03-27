import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface SelectionItem {
  id: string;
  label: string;
}

interface SelectionGridProps {
  items: SelectionItem[];
  selectedItems: string[];
  onSelect: (id: string) => void;
  multiSelect?: boolean;
}

export default function SelectionGrid({
  items,
  selectedItems,
  onSelect,
}: SelectionGridProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");

  return (
    <View style={styles.termsGrid}>
      {items.map((item) => {
        const isSelected = selectedItems.includes(item.id);
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.termCard,
              {
                backgroundColor: isSelected ? `${primary}15` : cardBg,
                borderColor: isSelected ? primary : "rgba(0,0,0,0.08)",
              },
            ]}
            onPress={() => onSelect(item.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.termLabel,
                { color: isSelected ? primary : textColor },
              ]}
            >
              {item.label}
            </Text>
            {isSelected && (
              <Ionicons name="checkmark-circle" size={18} color={primary} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  termsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  termCard: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
  },
  termLabel: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
  },
});
