import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Landlord } from "../types/propertyDetails.types";

interface PropertyHostProps {
  landlord: Landlord | null;
  onContact: () => void;
}

export default function PropertyHost({ landlord, onContact }: PropertyHostProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const mutedColor = useThemeColor({}, "icon");

  if (!landlord) return null;

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Listed By
      </Text>

      <View style={[styles.landlordCard, { backgroundColor: cardBg }]}>
        <View style={styles.landlordInfo}>
          <View
            style={[
              styles.landlordAvatar,
              { backgroundColor: `${primary}20` },
            ]}
          >
            <Text style={[styles.landlordInitial, { color: primary }]}>
              {landlord.full_name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.landlordDetails}>
            <Text style={[styles.landlordName, { color: textColor }]}>
              {landlord.full_name}
            </Text>
            <Text style={[styles.landlordRole, { color: mutedColor }]}>
              Property Owner
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.contactButton, { backgroundColor: primary }]}
          onPress={onContact}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#fff" />
          <Text style={styles.contactButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.sm,
  },
  landlordCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderRadius: Radius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  landlordInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  landlordAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  landlordInitial: {
    fontSize: Typography.fontSize.h2,
    fontFamily: "PoppinsBold",
  },
  landlordDetails: {
    marginLeft: Spacing.xs,
    flex: 1,
  },
  landlordName: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsSemiBold",
  },
  landlordRole: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xxxs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs,
    borderRadius: Radius.sm,
  },
  contactButtonText: {
    color: "#fff",
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsSemiBold",
  },
});
