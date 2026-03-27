import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import EmptyState from "@/components/ui/EmptyState";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DashboardStats } from "../types/dashboard.types";

const { width } = Dimensions.get("window");

interface DashboardPropertyOverviewProps {
  stats: DashboardStats;
}

export default function DashboardPropertyOverview({ stats }: DashboardPropertyOverviewProps) {
  const textColor = useThemeColor({}, "text");
  const cardBg = useThemeColor({}, "card");
  const primary = useThemeColor({}, "primary");
  const brandGold = "#CBAA58";

  const propertyStatusData = [
    {
      name: "Rented",
      population: stats.rentedProperties,
      color: primary,
      legendFontColor: textColor,
      legendFontSize: 13,
    },
    {
      name: "Vacant",
      population: stats.vacantProperties,
      color: brandGold,
      legendFontColor: textColor,
      legendFontSize: 13,
    },
    {
      name: "Maintenance",
      population: stats.maintenanceProperties,
      color: "#EF4444",
      legendFontColor: textColor,
      legendFontSize: 13,
    },
  ];

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
      <Text style={[styles.chartTitle, { color: textColor }]}>
        Property Overview
      </Text>
      <View style={styles.pieChartContainer}>
        {stats.totalProperties > 0 ? (
          <PieChart
            data={propertyStatusData}
            width={width - Spacing.lg * 2 - Spacing.md * 2}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
          />
        ) : (
          <EmptyState
            icon="home-outline"
            title="No properties yet"
            message="Add your first property to see insights"
          />
        )}
      </View>
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
  chartTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
  },
  pieChartContainer: {
    marginTop: Spacing.sm,
  },
  chart: {
    marginVertical: Spacing.sm,
    borderRadius: Radius.sm,
  },
});
