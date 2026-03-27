/**
 * Payments Screen — Seeker
 * Full payment history pulled from the Supabase payments table.
 *
 * Path: app/(seeker)/(screens)/payments.tsx
 */

import EmptyState from "@/components/ui/EmptyState";
import Header from "@/components/ui/Header";
import Radius from "@/constants/RADIUS";
import Spacing from "@/constants/SPACING";
import Typography from "@/constants/TYPOGRAPHY";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────

type PaymentProperty = {
  title: string;
  location: string;
};

type PaymentRecord = {
  id: string;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_gateway: string | null;
  payment_method: string | null;
  reference: string | null;
  currency: string;
  paid_at: string | null;
  created_at: string;
  // Supabase returns a single object for foreign key joins, not an array
  property: PaymentProperty | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  completed: { label: "Paid", color: "#10B981", icon: "checkmark-circle" },
  pending: { label: "Pending", color: "#F59E0B", icon: "time" },
  failed: { label: "Failed", color: "#EF4444", icon: "close-circle" },
  refunded: { label: "Refunded", color: "#6366F1", icon: "refresh-circle" },
};

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function PaymentsScreen() {
  const background = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const muted = useThemeColor({}, "icon");
  const primary = useThemeColor({}, "primary");

  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);

  const fetchPayments = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("payments")
        .select(
          `
          id,
          amount,
          status,
          payment_gateway,
          payment_method,
          reference,
          currency,
          paid_at,
          created_at,
          property:property_id (title, location)
        `,
        )
        .eq("tenant_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Cast via unknown to handle Supabase's inferred array type for joins
      const records = (data ?? []) as unknown as PaymentRecord[];
      setPayments(records);

      const total = records
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0);
      setTotalSpent(total);
    } catch (err) {
      console.error("[Payments] fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPayments();
  }, [fetchPayments]);

  // ── Payment row ─────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: PaymentRecord }) => {
    const cfg = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.pending;
    const dateStr = formatDate(item.paid_at ?? item.created_at);
    const gateway = item.payment_gateway
      ? item.payment_gateway.charAt(0).toUpperCase() +
        item.payment_gateway.slice(1)
      : "Card";

    return (
      <View style={[styles.paymentCard, { backgroundColor: cardBg }]}>
        {/* Icon */}
        <View
          style={[
            styles.paymentIconWrap,
            { backgroundColor: `${cfg.color}15` },
          ]}
        >
          <Ionicons name={cfg.icon} size={22} color={cfg.color} />
        </View>

        {/* Info */}
        <View style={styles.paymentInfo}>
          <Text
            style={[styles.paymentTitle, { color: textColor }]}
            numberOfLines={1}
          >
            {item.property?.title ?? "Rent Payment"}
          </Text>
          {item.property?.location ? (
            <Text
              style={[styles.paymentSub, { color: muted }]}
              numberOfLines={1}
            >
              {item.property.location}
            </Text>
          ) : null}
          <Text style={[styles.paymentDate, { color: muted }]}>
            {dateStr} · {gateway}
          </Text>
        </View>

        {/* Amount + status */}
        <View style={styles.paymentRight}>
          <Text style={[styles.paymentAmount, { color: textColor }]}>
            ₦{item.amount.toLocaleString()}
          </Text>
          <View
            style={[styles.statusBadge, { backgroundColor: `${cfg.color}15` }]}
          >
            <Text style={[styles.statusText, { color: cfg.color }]}>
              {cfg.label}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
        <Header variant="default" title="Payment History" showBackButton />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Main ────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: background }]}>
      <Header variant="default" title="Payment History" showBackButton />

      {/* Summary card */}
      {payments.length > 0 && (
        <View style={[styles.summaryCard, { backgroundColor: primary }]}>
          <Text style={styles.summaryLabel}>Total Paid</Text>
          <Text style={styles.summaryAmount}>
            ₦{totalSpent.toLocaleString()}
          </Text>
          <Text style={styles.summaryCount}>
            {payments.filter((p) => p.status === "completed").length} successful{" "}
            {payments.filter((p) => p.status === "completed").length === 1
              ? "payment"
              : "payments"}
          </Text>
        </View>
      )}

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          payments.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="card-outline"
            title="No payments yet"
            message="Your rent payment history will appear here once you make a payment."
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  summaryCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsRegular",
    color: "rgba(255,255,255,0.8)",
  },
  summaryAmount: {
    fontSize: 32,
    fontFamily: "PoppinsBold",
    color: "#FFFFFF",
    marginTop: Spacing.xxs,
  },
  summaryCount: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    color: "rgba(255,255,255,0.7)",
    marginTop: Spacing.xxs,
  },

  listContent: {
    padding: Spacing.lg,
  },
  listEmpty: {
    flex: 1,
    justifyContent: "center",
  },

  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: Radius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  paymentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  paymentInfo: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  paymentTitle: {
    fontSize: Typography.fontSize.h5,
    fontFamily: "PoppinsSemiBold",
    marginBottom: 2,
  },
  paymentSub: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsRegular",
  },
  paymentRight: {
    alignItems: "flex-end",
  },
  paymentAmount: {
    fontSize: Typography.fontSize.h3,
    fontFamily: "PoppinsBold",
    marginBottom: Spacing.xxs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.h6,
    fontFamily: "PoppinsSemiBold",
  },
});
