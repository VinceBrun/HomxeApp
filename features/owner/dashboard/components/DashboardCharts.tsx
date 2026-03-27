import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import { useThemeColor } from "@/hooks/useThemeColor";

const { width } = Dimensions.get("window");

export default function DashboardRevenueChart() {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const brandGold = "#CBAA58";

  const revenueData = {
    labels: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        data: [1200, 1350, 1500, 1450, 1600, 1800],
        color: (_opacity = 1) => brandGold,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: cardBg,
    backgroundGradientTo: cardBg,
    color: (_opacity = 1) => brandGold,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForLabels: {
      fontFamily: "PoppinsRegular",
      fontSize: 11,
    },
  };

  return (
    <View style={[styles.chartCard, { backgroundColor: cardBg }]}>
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, { color: textColor }]}>
          Revenue Trend
        </Text>
        <TouchableOpacity>
          <Text style={[styles.chartLink, { color: primary }]}>
            View Details
          </Text>
        </TouchableOpacity>
      </View>
      <LineChart
        data={revenueData}
        width={width - Spacing.lg * 2 - Spacing.md * 2}
        height={200}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={true}
        withInnerLines={false}
        withOuterLines={true}
        withVerticalLines={false}
        withHorizontalLines={true}
        formatYLabel={(value) => `₦${value}k`}
      />
      <Text style={[styles.chartSubtext, { color: mutedColor }]}>
        Last 6 months revenue performance
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
  },
  chartLink: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
  },
  chart: {
    marginVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
  chartSubtext: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
    textAlign: "center",
    marginTop: Spacing.xs,
  },
});
