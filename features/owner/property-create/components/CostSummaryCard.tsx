import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CostSummaryCardProps {
  rent: number;
  deposit: number;
  agent: number;
  legal: number;
  totalUpfront: number;
  firstPayment: number;
}

export default function CostSummaryCard({
  rent,
  deposit,
  agent,
  legal,
  totalUpfront,
  firstPayment,
}: CostSummaryCardProps) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");
  const tertiary = useThemeColor({}, "tertiary");

  return (
    <LinearGradient
      colors={[`${tertiary}20`, `${tertiary}10`]}
      style={styles.summaryCard}
    >
      <View style={styles.summaryHeader}>
        <Ionicons name="calculator" size={24} color={tertiary} />
        <Text style={[styles.summaryTitle, { color: textColor }]}>
          Cost Summary
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: mutedColor }]}>
          Monthly Rent
        </Text>
        <Text style={[styles.summaryValue, { color: textColor }]}>
          ₦{rent.toLocaleString()}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabel, { color: mutedColor }]}>
          Security Deposit
        </Text>
        <Text style={[styles.summaryValue, { color: textColor }]}>
          ₦{deposit.toLocaleString()}
        </Text>
      </View>

      {agent > 0 && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: mutedColor }]}>
            Agent Fee
          </Text>
          <Text style={[styles.summaryValue, { color: textColor }]}>
            ₦{agent.toLocaleString()}
          </Text>
        </View>
      )}

      {legal > 0 && (
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: mutedColor }]}>
            Legal Fee
          </Text>
          <Text style={[styles.summaryValue, { color: textColor }]}>
            ₦{legal.toLocaleString()}
          </Text>
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: mutedColor }]} />

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabelBold, { color: textColor }]}>
          Total Upfront
        </Text>
        <Text style={[styles.summaryValueBold, { color: tertiary }]}>
          ₦{totalUpfront.toLocaleString()}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={[styles.summaryLabelBold, { color: textColor }]}>
          First Payment
        </Text>
        <Text style={[styles.summaryValueBold, { color: primary }]}>
          ₦{firstPayment.toLocaleString()}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
    gap: Spacing.xxs,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.xxs,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
  },
  summaryValue: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsMedium",
  },
  summaryLabelBold: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
  },
  summaryValueBold: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
  },
  divider: {
    height: 1,
    opacity: 0.2,
    marginVertical: Spacing.xs,
  },
});
