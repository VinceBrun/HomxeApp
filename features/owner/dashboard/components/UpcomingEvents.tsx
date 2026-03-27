import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "@/components/ui/EmptyState";
import Spacing from "@/constants/SPACING";
import Radius from "@/constants/RADIUS";
import { useThemeColor } from "@/hooks/useThemeColor";
import { UpcomingEvent } from "../types/dashboard.types";

interface DashboardUpcomingEventsProps {
  events: UpcomingEvent[];
}

export default function DashboardUpcomingEvents({ events }: DashboardUpcomingEventsProps) {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor({}, "icon");
  const cardBg = useThemeColor({}, "card");

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Upcoming This Week
      </Text>
      {events.length > 0 ? (
        events.map((event) => (
          <View
            key={event.id}
            style={[styles.upcomingCard, { backgroundColor: cardBg }]}
          >
            <View
              style={[
                styles.upcomingIconContainer,
                { backgroundColor: `${event.color}15` },
              ]}
            >
              <Ionicons name={event.icon} size={20} color={event.color} />
            </View>
            <View style={styles.upcomingContent}>
              <Text
                style={[styles.upcomingTitle, { color: textColor }]}
                numberOfLines={1}
              >
                {event.title}
              </Text>
              <Text
                style={[styles.upcomingDescription, { color: mutedColor }]}
                numberOfLines={1}
              >
                {event.description}
              </Text>
              <View style={styles.upcomingDateContainer}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={mutedColor}
                />
                <Text style={[styles.upcomingDate, { color: mutedColor }]}>
                  {event.date}
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <EmptyState
          icon="calendar-outline"
          title="No upcoming events"
          message="Your scheduled inspections and payments will appear here"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemibold",
    marginBottom: Spacing.md,
  },
  upcomingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  upcomingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.sm,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 14,
    fontFamily: "PoppinsSemibold",
    marginBottom: 2,
  },
  upcomingDescription: {
    fontSize: 13,
    fontFamily: "PoppinsRegular",
    marginBottom: 4,
  },
  upcomingDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  upcomingDate: {
    fontSize: 12,
    fontFamily: "PoppinsRegular",
  },
});
