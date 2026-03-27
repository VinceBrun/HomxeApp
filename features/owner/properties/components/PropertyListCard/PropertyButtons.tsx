import Button from "@/components/ui/Button";
import Spacing from "@/constants/SPACING";
import { PropertyStatus } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";

interface PropertyButtonsProps {
  status: PropertyStatus;
  onViewDetails: () => void;
  onViewInquiries?: () => void;
  onContactTenant?: () => void;
}

export default function PropertyButtons({
  status,
  onViewDetails,
  onViewInquiries,
  onContactTenant,
}: PropertyButtonsProps) {
  return (
    <View style={styles.buttonRow}>
      <View style={styles.buttonWrapper}>
        <Button
          variant="outline"
          title="View Details"
          handlePress={onViewDetails}
        />
      </View>

      {(status === "listed" || status === "rented") && onViewInquiries && (
        <View style={styles.buttonWrapper}>
          <Button title="Inquiries" handlePress={onViewInquiries} />
        </View>
      )}

      {status === "rented" && onContactTenant && (
        <View style={styles.buttonWrapper}>
          <Button title="Contact Tenant" handlePress={onContactTenant} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  buttonWrapper: {
    flex: 1,
  },
});
