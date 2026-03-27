import React from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import { Colors } from "@/constants/COLORS";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";

interface Web3InfoModalProps {
  visible: boolean;
  onClose: () => void;
  onJoinWaitlist: () => void;
}

export default function Web3InfoModal({
  visible,
  onClose,
  onJoinWaitlist,
}: Web3InfoModalProps) {
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const brandGold = Colors.light.tertiary; // #CBAA58
  const brandGreen = Colors.light.primary; // #196606

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textColor }]}>
              Fractional Ownership
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            <Text style={[styles.modalSectionTitle, { color: textColor }]}>
              What is Fractional Ownership?
            </Text>
            <Text style={[styles.modalText, { color: mutedColor }]}>
              Invest in real estate with as little as ₦100,000. Own shares of
              premium properties and earn monthly rental income without the
              hassle of full ownership.
            </Text>

            <Text style={[styles.modalSectionTitle, { color: textColor }]}>
              How It Works
            </Text>
            <View style={styles.stepContainer}>
              <Text
                style={[
                  styles.stepNumber,
                  { backgroundColor: brandGold, color: "#000" },
                ]}
              >
                1
              </Text>
              <Text style={[styles.stepText, { color: mutedColor }]}>
                Browse verified properties available for fractional investment
              </Text>
            </View>
            <View style={styles.stepContainer}>
              <Text
                style={[
                  styles.stepNumber,
                  { backgroundColor: brandGold, color: "#000" },
                ]}
              >
                2
              </Text>
              <Text style={[styles.stepText, { color: mutedColor }]}>
                Purchase shares starting from ₦100,000
              </Text>
            </View>
            <View style={styles.stepContainer}>
              <Text
                style={[
                  styles.stepNumber,
                  { backgroundColor: brandGold, color: "#000" },
                ]}
              >
                3
              </Text>
              <Text style={[styles.stepText, { color: mutedColor }]}>
                Earn monthly rental income proportional to your ownership
              </Text>
            </View>
            <View style={styles.stepContainer}>
              <Text
                style={[
                  styles.stepNumber,
                  { backgroundColor: brandGold, color: "#000" },
                ]}
              >
                4
              </Text>
              <Text style={[styles.stepText, { color: mutedColor }]}>
                Sell your shares anytime on our marketplace
              </Text>
            </View>

            <Text style={[styles.modalSectionTitle, { color: textColor }]}>
              Benefits
            </Text>
            <View style={styles.benefitContainer}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={brandGreen}
              />
              <Text style={[styles.benefitText, { color: mutedColor }]}>
                Low entry point - Start from ₦100k
              </Text>
            </View>
            <View style={styles.benefitContainer}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={brandGreen}
              />
              <Text style={[styles.benefitText, { color: mutedColor }]}>
                Portfolio diversification across multiple properties
              </Text>
            </View>
            <View style={styles.benefitContainer}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={brandGreen}
              />
              <Text style={[styles.benefitText, { color: mutedColor }]}>
                High liquidity - Trade shares easily
              </Text>
            </View>
            <View style={styles.benefitContainer}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={brandGreen}
              />
              <Text style={[styles.benefitText, { color: mutedColor }]}>
                Passive income - Monthly rental distributions
              </Text>
            </View>

            <Text style={[styles.modalSectionTitle, { color: textColor }]}>
              Launch Timeline
            </Text>
            <View
              style={[
                styles.timelineContainer,
                { backgroundColor: `${brandGold}20` },
              ]}
            >
              <Text style={[styles.timelineText, { color: mutedColor }]}>
                Expected Launch:{" "}
                <Text
                  style={{ color: brandGold, fontFamily: "PoppinsSemibold" }}
                >
                  Q2 2026
                </Text>
              </Text>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <Button title="Join Waitlist" handlePress={onJoinWaitlist} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    maxHeight: "85%",
    paddingTop: Spacing.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "PoppinsSemibold",
  },
  modalBody: {
    paddingHorizontal: Spacing.lg,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  modalText: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    lineHeight: 22,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
    textAlign: "center",
    lineHeight: 28,
    marginRight: Spacing.sm,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    lineHeight: 22,
  },
  benefitContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "PoppinsRegular",
  },
  timelineContainer: {
    padding: Spacing.md,
    borderRadius: Radius.sm,
    marginBottom: Spacing.lg,
  },
  timelineText: {
    fontSize: 14,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
  },
  modalFooter: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.05)",
  },
});
