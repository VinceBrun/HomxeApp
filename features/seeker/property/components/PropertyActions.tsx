/**
 * PropertyActions — Sticky bottom action bar on the property details screen.
 * Layout: [Save] [Share]          [Tour] [Pay Rent]
 */

import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useFavorites } from "@/hooks/useFavorites";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSession } from "@/providers/session";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PropertyActionsProps {
  propertyId: string;
  propertyTitle?: string;
  price: number;
  landlordId?: string;
  onBookTour: () => void;
  onShare?: () => void;
}

export default function PropertyActions({
  propertyId,
  propertyTitle = "Property",
  price,
  landlordId,
  onBookTour,
  onShare,
}: PropertyActionsProps) {
  const router = useRouter();
  const { user, profile } = useSession();
  const primary = useThemeColor({}, "primary");
  const cardBg = useThemeColor({}, "card");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const { isSaved, toggleSave, loading } = useFavorites();

  const handlePayRent = () => {
    router.push({
      pathname: "/(seeker)/property/pay",
      params: {
        propertyId,
        propertyTitle,
        amountNaira: String(price),
        landlordId: landlordId ?? "",
        customerEmail: user?.email ?? "",
        customerId: user?.id ?? "",
        customerName: profile?.full_name ?? "Homxe User",
        purpose: "rent",
      },
    });
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: cardBg }]}>
      <View style={[styles.topBorder, { backgroundColor: textColor + "10" }]} />
      <SafeAreaView edges={["bottom"]}>
        <View style={styles.row}>
          {/* Save */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => toggleSave(propertyId)}
            disabled={loading}
          >
            <Ionicons
              name={isSaved(propertyId) ? "heart" : "heart-outline"}
              size={22}
              color={isSaved(propertyId) ? "#EF4444" : textColor}
            />
            <Text style={[styles.iconLabel, { color: mutedColor }]}>Save</Text>
          </TouchableOpacity>

          {/* Share */}
          {onShare && (
            <TouchableOpacity style={styles.iconBtn} onPress={onShare}>
              <Ionicons
                name="share-social-outline"
                size={22}
                color={textColor}
              />
              <Text style={[styles.iconLabel, { color: mutedColor }]}>
                Share
              </Text>
            </TouchableOpacity>
          )}

          {/* Spacer pushes buttons to the right */}
          <View style={styles.spacer} />

          {/* Tour */}
          <TouchableOpacity
            style={[styles.tourBtn, { borderColor: primary }]}
            onPress={onBookTour}
          >
            <Ionicons name="calendar-outline" size={18} color={primary} />
            <Text style={[styles.tourText, { color: primary }]}>Tour</Text>
          </TouchableOpacity>

          {/* Pay Rent */}
          <TouchableOpacity
            style={[styles.payBtn, { backgroundColor: primary }]}
            onPress={handlePayRent}
          >
            <Ionicons name="card-outline" size={18} color="#fff" />
            <Text style={styles.payText}>Pay Rent</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 20,
  },
  topBorder: {
    height: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  iconBtn: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    width: 44,
  },
  iconLabel: {
    fontSize: 10,
    fontFamily: "PoppinsRegular",
  },
  // Pushes Tour + Pay Rent to the far right
  spacer: {
    flex: 1,
  },
  tourBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xxs,
    height: 46,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
  },
  tourText: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
  },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xxs,
    height: 46,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.sm,
    minWidth: 120,
  },
  payText: {
    color: "#FFFFFF",
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
  },
});
