/**
 * Bookings Screen
 * Displays user's property bookings with ongoing and past tabs
 */

import BookingCard from "@/components/ui/BookingsCard";
import Header from "@/components/ui/Header";
import CollapsibleHeaderView from "@/components/ui/profile/CollapsibleHeaderTabView";
import useProfile from "@/hooks/shared/useProfile";
import useSession from "@/hooks/shared/useSession";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AVATAR_BUCKET = "avatars";

export default function Bookings() {
  const { profile } = useProfile();
  useSession();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ongoing" | "past">("ongoing");

  const background = useThemeColor({}, "background");
  const highlight = useThemeColor({}, "primary");
  const muted = useThemeColor({}, "icon");

  useEffect(() => {
    if (profile?.avatar) {
      const { data } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(profile.avatar);
      setAvatarUrl(data?.publicUrl || null);
    }
  }, [profile?.avatar]);

  const bookingCardMock = (
    <BookingCard
      date="June 2025"
      title="Luxury Bungalow in Lekki"
      reviews={72}
      location="Lekki, Lagos"
      owner={{
        avatar: avatarUrl,
        name: profile?.fullName || "Property Owner",
        role: "Property Owner",
      }}
      price="$30"
    />
  );

  return (
    <CollapsibleHeaderView
      header={
        <SafeAreaView>
          <Header title="My Bookings" />
        </SafeAreaView>
      }
      content={
        <SafeAreaView
          style={[styles.container, { backgroundColor: background }]}
        >
          <View className="px-4">
            {/* Tabs */}
            <View className="flex-row justify-start space-x-4 mb-2">
              <TouchableOpacity onPress={() => setActiveTab("ongoing")}>
                <Text
                  className="text-lg font-semibold"
                  style={{ color: activeTab === "ongoing" ? highlight : muted }}
                >
                  Ongoing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab("past")}>
                <Text
                  className="text-lg font-semibold"
                  style={{ color: activeTab === "past" ? highlight : muted }}
                >
                  Past
                </Text>
              </TouchableOpacity>
            </View>

            <View className="h-px bg-gray-100 mb-4" />

            {/* Bookings List */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="space-y-4"
            >
              {activeTab === "ongoing"
                ? [bookingCardMock, bookingCardMock]
                : new Array(6)
                    .fill(bookingCardMock)
                    .map((card, i) => <View key={i}>{card}</View>)}
            </ScrollView>
          </View>
        </SafeAreaView>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
