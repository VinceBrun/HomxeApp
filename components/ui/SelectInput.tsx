import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SelectInput = forwardRef<View, SelectInputProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option",
      disabled = false,
    },
    ref,
  ) => {
    const [modalVisible, setModalVisible] = useState(false);

    const backgroundColor = useThemeColor({}, "card");
    const primary = useThemeColor({}, "primary");
    const textColor = useThemeColor({}, "text");
    const mutedColor = useThemeColor({}, "icon");
    const borderColor = "rgba(0,0,0,0.08)";

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setModalVisible(false);
    };

    return (
      <>
        <TouchableOpacity
          ref={ref}
          style={[styles.selectButton, { backgroundColor, borderColor }]}
          onPress={() => !disabled && setModalVisible(true)}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text
            style={[
              styles.selectText,
              { color: selectedOption ? textColor : mutedColor },
            ]}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={mutedColor}
            style={styles.chevronIcon}
          />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View
              style={[styles.modalContent, { backgroundColor }]}
              onStartShouldSetResponder={() => true}
            >
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: textColor }]}>
                  {placeholder}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={mutedColor} />
                </TouchableOpacity>
              </View>

              {/* Options List */}
              <ScrollView style={styles.optionsList}>
                {options.map((option) => {
                  const isSelected = option.value === value;

                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionItem,
                        isSelected && { backgroundColor: `${primary}15` },
                      ]}
                      onPress={() => handleSelect(option.value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          { color: isSelected ? primary : textColor },
                        ]}
                      >
                        {option.label}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </>
    );
  },
);

SelectInput.displayName = "SelectInput";

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md + 2, // 14px to match TextInput height
    borderRadius: 1000,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 50,
  },
  selectText: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
  chevronIcon: {
    marginLeft: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingBottom: Spacing.xl + Spacing.lg,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
  },
  closeButton: {
    padding: Spacing.xs,
  },
  optionsList: {
    paddingHorizontal: Spacing.lg,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    marginVertical: Spacing.xs,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
});

export default SelectInput;
