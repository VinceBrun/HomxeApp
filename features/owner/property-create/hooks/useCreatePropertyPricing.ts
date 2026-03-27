import { useRef, useEffect } from "react";
import { Alert, Animated } from "react-native";
import { useRouter } from "expo-router";
import { usePropertyCreate } from "../context/PropertyCreateContext";

export const useCreatePropertyPricing = () => {
  const router = useRouter();
  const { data, updateData } = usePropertyCreate();

  const {
    monthlyRent,
    securityDeposit,
    agentFee,
    legalFee,
    selectedPaymentTerms,
    leaseDuration,
  } = data;

  const setMonthlyRent = (val: string) => updateData({ monthlyRent: val });
  const setSecurityDeposit = (val: string) => updateData({ securityDeposit: val });
  const setAgentFee = (val: string) => updateData({ agentFee: val });
  const setLegalFee = (val: string) => updateData({ legalFee: val });
  const setSelectedPaymentTerms = (val: string[]) => updateData({ selectedPaymentTerms: val });
  const setLeaseDuration = (val: string) => updateData({ leaseDuration: val });

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Calculate totals
  const rent = parseFloat(monthlyRent || "0");
  const deposit = parseFloat(securityDeposit || "0");
  const agent = parseFloat(agentFee || "0");
  const legal = parseFloat(legalFee || "0");
  const totalUpfront = deposit + agent + legal;
  const firstPayment = rent + totalUpfront;

  const togglePaymentTerm = (termId: string) => {
    setSelectedPaymentTerms(
      selectedPaymentTerms.includes(termId)
        ? selectedPaymentTerms.filter((id) => id !== termId)
        : [...selectedPaymentTerms, termId]
    );
  };

  const handleNext = () => {
    if (!monthlyRent || !securityDeposit) {
      Alert.alert(
        "Required Fields",
        "Please enter monthly rent and security deposit"
      );
      return;
    }
    if (selectedPaymentTerms.length === 0) {
      Alert.alert(
        "Payment Terms Required",
        "Please select at least one payment term"
      );
      return;
    }
    if (!leaseDuration) {
      Alert.alert("Lease Duration Required", "Please select lease duration");
      return;
    }

    router.push("/(owner)/property/create/step4");
  };

  const isComplete =
    !!monthlyRent &&
    !!securityDeposit &&
    selectedPaymentTerms.length > 0 &&
    !!leaseDuration;

  return {
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
  };
};
