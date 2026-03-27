import React from "react";
import { View, Text, ScrollView, Animated, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import Radius from "@/constants/RADIUS";
import { Ionicons } from "@expo/vector-icons";

import { useCreatePropertyPricing } from "@/features/owner/property-create/hooks/useCreatePropertyPricing";
import CreatePropertyHeader from "@/features/owner/property-create/components/CreatePropertyHeader";
import PricingInputCard from "@/features/owner/property-create/components/PricingInputCard";
import CostSummaryCard from "@/features/owner/property-create/components/CostSummaryCard";
import SelectionGrid from "@/features/owner/property-create/components/SelectionGrid";
import FloatingNextButton from "@/features/owner/property-create/components/FloatingNextButton";

const PAYMENT_TERMS = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "biannual", label: "Biannual" },
  { id: "annual", label: "Annual" },
  { id: "upfront", label: "Full Upfront" },
  { id: "flexible", label: "Flexible" },
];

const LEASE_DURATIONS = [
  { id: "6months", label: "6 Months" },
  { id: "1year", label: "1 Year" },
  { id: "2years", label: "2 Years" },
  { id: "3years", label: "3 Years" },
  { id: "5years", label: "5 Years" },
  { id: "flexible", label: "Flexible" },
];

export default function CreatePropertyStep3() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const {
    monthlyRent,
    setMonthlyRent,
    securityDeposit,
    setSecurityDeposit,
    agentFee,
    setAgentFee,
    legalFee,
    setLegalFee,
    selectedPaymentTerms,
    togglePaymentTerm,
    leaseDuration,
    setLeaseDuration,
    rent,
    deposit,
    agent,
    legal,
    totalUpfront,
    firstPayment,
    handleNext,
    isComplete,
    fadeAnim,
  } = useCreatePropertyPricing();

  const CompletionBadge = ({ completed }: { completed: boolean }) => (
    <View
      style={[
        styles.completionBadge,
        { borderColor: completed ? primary : mutedColor },
        completed && { backgroundColor: primary },
      ]}
    >
      {completed && <Ionicons name="checkmark-circle" size={16} color="#fff" />}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <CreatePropertyHeader
        currentStep={3}
        totalSteps={5}
        title="Pricing & Payment"
        progress={0.6}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pricing Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Pricing Details
              </Text>
              <Text style={[styles.sectionDescription, { color: mutedColor }]}>
                Set competitive prices for your property
              </Text>
            </View>
            <CompletionBadge completed={!!monthlyRent && !!securityDeposit} />
          </View>

          <PricingInputCard
            icon="cash-outline"
            label="Monthly Rent"
            value={monthlyRent}
            onChangeText={setMonthlyRent}
            required
            placeholder="450000"
          />

          <PricingInputCard
            icon="shield-checkmark-outline"
            label="Security Deposit"
            value={securityDeposit}
            onChangeText={setSecurityDeposit}
            required
            placeholder="450000"
          />

          <PricingInputCard
            icon="briefcase-outline"
            label="Agent Fee"
            value={agentFee}
            onChangeText={setAgentFee}
            placeholder="0"
          />

          <PricingInputCard
            icon="document-text-outline"
            label="Legal Fee"
            value={legalFee}
            onChangeText={setLegalFee}
            placeholder="0"
          />
        </Animated.View>

        {/* Cost Summary */}
        {(rent > 0 || totalUpfront > 0) && (
          <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
            <CostSummaryCard
              rent={rent}
              deposit={deposit}
              agent={agent}
              legal={legal}
              totalUpfront={totalUpfront}
              firstPayment={firstPayment}
            />
          </Animated.View>
        )}

        {/* Payment Terms */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Payment Terms
              </Text>
              <Text style={[styles.sectionDescription, { color: mutedColor }]}>
                Select accepted payment schedules (can choose multiple)
              </Text>
            </View>
            <CompletionBadge completed={selectedPaymentTerms.length > 0} />
          </View>

          <SelectionGrid
            items={PAYMENT_TERMS}
            selectedItems={selectedPaymentTerms}
            onSelect={togglePaymentTerm}
            multiSelect
          />
        </Animated.View>

        {/* Lease Duration */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Lease Duration
              </Text>
              <Text style={[styles.sectionDescription, { color: mutedColor }]}>
                Preferred lease length
              </Text>
            </View>
            <CompletionBadge completed={!!leaseDuration} />
          </View>

          <SelectionGrid
            items={LEASE_DURATIONS}
            selectedItems={leaseDuration ? [leaseDuration] : []}
            onSelect={setLeaseDuration}
          />
        </Animated.View>

        <View style={{ height: Spacing.xxxl }} />
      </ScrollView>

      <FloatingNextButton
        onPress={handleNext}
        label="Continue to Photos"
        visible={!!isComplete}
        fadeAnim={fadeAnim}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: Spacing.lg },
  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.xxxs,
  },
  sectionDescription: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
  },
  completionBadge: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
