import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CreatePropertyHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  progress: number; // 0 to 1
}

export default function CreatePropertyHeader({
  currentStep,
  totalSteps,
  title,
  progress,
}: CreatePropertyHeaderProps) {
  const router = useRouter();
  const primary = useThemeColor({}, "primary");
  const tertiary = useThemeColor({}, "tertiary");

  return (
    <LinearGradient colors={[primary, primary]} style={styles.header}>
      <SafeAreaView edges={["top"]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerSubtitle}>
              Step {currentStep} of {totalSteps}
            </Text>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Ionicons name="bookmark-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: "rgba(255,255,255,0.3)" },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${progress * 100}%`, backgroundColor: tertiary },
              ]}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: Spacing.md },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: { flex: 1, marginLeft: Spacing.md },
  headerSubtitle: {
    fontSize: Typography.fontSize.h6,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "PoppinsRegular",
  },
  headerTitle: {
    fontSize: Typography.fontSize.h2,
    color: "#fff",
    fontFamily: "PoppinsBold",
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.xs },
  progressTrack: {
    height: 4,
    borderRadius: Radius.sm,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: Radius.sm,
  },
});
