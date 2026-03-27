import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface PublishActionsProps {
  agreeToTerms: boolean;
  setAgreeToTerms: (value: boolean) => void;
  isPublishing: boolean;
  onPublish: () => void;
  fadeAnim: Animated.Value;
}

export default function PublishActions({
  agreeToTerms,
  setAgreeToTerms,
  isPublishing,
  onPublish,
  fadeAnim,
}: PublishActionsProps) {
  const textColor = useThemeColor({}, "text");
  const primary = useThemeColor({}, "primary");
  const mutedColor = useThemeColor({}, "icon");

  return (
    <>
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAgreeToTerms(!agreeToTerms)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              {
                backgroundColor: agreeToTerms ? primary : "transparent",
                borderColor: agreeToTerms ? primary : mutedColor,
              },
            ]}
          >
            {agreeToTerms && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
          <Text style={[styles.termsText, { color: textColor }]}>
            I agree to the{" "}
            <Text style={{ color: primary, fontFamily: "PoppinsSemiBold" }}>
              Terms & Conditions
            </Text>{" "}
            and confirm all information is accurate
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.floatingButtonContainer, { opacity: fadeAnim }]}
      >
        <TouchableOpacity
          style={[styles.floatingButton, { opacity: agreeToTerms ? 1 : 0.5 }]}
          onPress={onPublish}
          activeOpacity={0.9}
          disabled={!agreeToTerms || isPublishing}
        >
          <LinearGradient
            colors={[primary, primary]}
            style={styles.floatingButtonGradient}
          >
            {isPublishing ? (
              <Text style={styles.floatingButtonText}>Publishing...</Text>
            ) : (
              <>
                <Ionicons name="rocket-outline" size={20} color="#fff" />
                <Text style={styles.floatingButtonText}>Publish Property</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: Spacing.xl },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.xs,
    marginTop: 2,
  },
  termsText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    flex: 1,
    lineHeight: 20,
  },
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
