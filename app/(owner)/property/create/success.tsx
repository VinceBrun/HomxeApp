/**
 * SUCCESS SCREEN
 * ✅ Celebration message
 * ✅ Quick actions
 * ✅ Tips for success
 */

import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertyListingSuccess() {
  const router = useRouter();

  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const tertiary = useThemeColor({}, "tertiary");
  const mutedColor = useThemeColor({}, "icon");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Icon */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[`${primary}20`, `${primary}10`]}
              style={styles.iconGradient}
            >
              <Ionicons name="checkmark-circle" size={80} color={primary} />
            </LinearGradient>
          </Animated.View>

          {/* Success Message */}
          <Animated.View
            style={[styles.messageContainer, { opacity: fadeAnim }]}
          >
            <Text style={[styles.title, { color: textColor }]}>
              Property Published!
            </Text>
            <Text style={[styles.subtitle, { color: mutedColor }]}>
              Your property is now live and visible to potential tenants
            </Text>
          </Animated.View>

          {/* Stats */}
          <Animated.View
            style={[
              styles.statsCard,
              { backgroundColor: cardBg, opacity: fadeAnim },
            ]}
          >
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={24} color={tertiary} />
              <Text style={[styles.statValue, { color: textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: mutedColor }]}>
                Views
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: mutedColor }]} />

            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={24} color={tertiary} />
              <Text style={[styles.statValue, { color: textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: mutedColor }]}>
                Favorites
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: mutedColor }]} />

            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={24} color={tertiary} />
              <Text style={[styles.statValue, { color: textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: mutedColor }]}>
                Inquiries
              </Text>
            </View>
          </Animated.View>

          {/* Actions */}
          <Animated.View
            style={[styles.actionsContainer, { opacity: fadeAnim }]}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/(owner)/(tabs)/properties")}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[primary, primary]}
                style={styles.primaryButtonGradient}
              >
                <Ionicons name="eye-outline" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>View Property</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, { backgroundColor: cardBg }]}
              onPress={() => router.push("/(owner)/property/create/step1")}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color={primary} />
              <Text style={[styles.secondaryButtonText, { color: primary }]}>
                Add Another Property
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Tips */}
          <Animated.View
            style={[
              styles.tipsCard,
              { backgroundColor: `${primary}08`, opacity: fadeAnim },
            ]}
          >
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb-outline" size={20} color={primary} />
              <Text style={[styles.tipsTitle, { color: primary }]}>
                Tips for Success
              </Text>
            </View>

            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={primary} />
                <Text style={[styles.tipText, { color: textColor }]}>
                  Respond quickly to inquiries
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={primary} />
                <Text style={[styles.tipText, { color: textColor }]}>
                  Keep photos updated
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color={primary} />
                <Text style={[styles.tipText, { color: textColor }]}>
                  Update availability status
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContainer: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize.h1,
    fontFamily: "PoppinsBold",
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    lineHeight: 22,
  },
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: Typography.fontSize.h1,
    fontFamily: "PoppinsBold",
    marginTop: Spacing.xxxs,
  },
  statLabel: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    marginTop: Spacing.xxxs,
  },
  divider: {
    width: 1,
    height: 50,
    opacity: 0.2,
  },
  actionsContainer: {
    width: "100%",
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  primaryButton: {
    borderRadius: Radius.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.xxs,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm + 4,
    borderRadius: Radius.md,
    gap: Spacing.xxs,
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemiBold",
  },
  tipsCard: {
    width: "100%",
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
    gap: Spacing.xxs,
  },
  tipsTitle: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
  },
  tipsList: {
    gap: Spacing.xs,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxs,
  },
  tipText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    flex: 1,
  },
});
