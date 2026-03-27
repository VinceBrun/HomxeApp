import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PropertyListItem } from "@/types";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

import PropertyActions from "./PropertyListCard/PropertyActions";
import PropertyButtons from "./PropertyListCard/PropertyButtons";
import PropertyImageGallery from "./PropertyListCard/PropertyImageGallery";
import PropertyInfo from "./PropertyListCard/PropertyInfo";
import PropertyMetrics from "./PropertyListCard/PropertyMetrics";

interface PropertyListCardProps {
  property: PropertyListItem;
  onPress: () => void;
  onEdit: () => void;
  onViewAnalytics: () => void;
  onShare: () => void;
  onViewInquiries?: () => void;
  onContactTenant?: () => void;
}

const STATUS_CONFIG = {
  listed: { label: "Active", color: "#2D5F3F" },
  rented: { label: "Rented", color: "#2D5F3F" },
  maintenance: { label: "Maintenance", color: "#CBAA58" },
  draft: { label: "Draft", color: "#CBAA58" },
  delisted: { label: "Archived", color: "#6B7280" },
};

export default function PropertyListCard({
  property,
  onPress,
  onEdit,
  onViewAnalytics,
  onShare,
  onViewInquiries,
  onContactTenant,
}: PropertyListCardProps) {
  const cardBg = useThemeColor({}, "card");
  const primary = "#2D5F3F";

  const handleMoreOptions = () => {
    Alert.alert("More Options", "Choose an action", [
      { text: "Mark as Rented", onPress: () => console.log("Mark as rented") },
      { text: "Promote Listing", onPress: () => console.log("Promote") },
      {
        text: "Archive",
        onPress: () => console.log("Archive"),
        style: "destructive",
      },
      {
        text: "Delete",
        onPress: () => console.log("Delete"),
        style: "destructive",
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: cardBg }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <PropertyImageGallery
        images={property.images || []}
        status={property.status}
        statusConfig={STATUS_CONFIG[property.status]}
      />

      <View style={styles.content}>
        <PropertyInfo property={property} />

        <PropertyMetrics property={property} />

        <PropertyActions
          onEdit={onEdit}
          onViewAnalytics={onViewAnalytics}
          onShare={onShare}
          onMoreOptions={handleMoreOptions}
          primaryColor={primary}
        />

        <PropertyButtons
          status={property.status}
          onViewDetails={onPress}
          onViewInquiries={onViewInquiries}
          onContactTenant={onContactTenant}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: Spacing.md,
  },
});
