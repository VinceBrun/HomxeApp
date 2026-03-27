/**
 * Top Landlords Screen
 * Displays ranked list of landlords by rating and property count
 */

import LandlordCard from "@/components/ui/LandlordsCard";
import SearchBar from "@/components/ui/SearchBar";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Landlord = {
  landlord_id: string;
  full_name: string;
  email: string;
  num_properties: number;
  average_rating: number;
  review_count: number;
  avatar_url?: string | null;
};

export default function TopLandlords() {
  const router = useRouter();
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const background = useThemeColor({}, "background");
  const primary = useThemeColor({}, "primary");
  const titleText = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");

  useEffect(() => {
    const fetchLandlords = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("top_landlords_with_email")
        .select("*")
        .order("score", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching landlords:", error);
      } else {
        setLandlords(data || []);
      }

      setLoading(false);
    };

    fetchLandlords();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <ScrollView className="flex-1 px-4 py-8">
        {/* Search Bar */}
        <SearchBar
          placeholder="Search landlords near you"
          renderIcon={() => (
            <FontAwesome name="search" size={18} color="gray" />
          )}
        />

        {/* Header */}
        <View className="px-4 mt-6">
          <Text
            className="text-xl font-poppinsSemibold"
            style={{ color: titleText }}
          >
            Top Landlords
          </Text>
          <Text className="text-sm font-poppins mt-1" style={{ color: muted }}>
            Find the best recommendations place to live.
          </Text>
        </View>

        {/* Landlords List */}
        {loading ? (
          <View className="flex-1 justify-center items-center mt-8">
            <ActivityIndicator size="large" color={primary} />
          </View>
        ) : (
          <View className="flex-wrap flex-row justify-between p-4">
            {landlords.map((landlord, index) => (
              <LandlordCard
                key={landlord.landlord_id}
                landlord={{
                  rank: index + 1,
                  image:
                    landlord.avatar_url ??
                    require("@/assets/images/Andrew.png"),
                  name: landlord.full_name,
                  rating: parseFloat(
                    landlord.average_rating?.toFixed(1) || "0.0",
                  ),
                  houseCount: landlord.num_properties,
                }}
                starIcon={<FontAwesome name="star" size={16} color="#FFD700" />}
                houseIcon={
                  <MaterialCommunityIcons
                    name="home-outline"
                    size={16}
                    color="#333"
                  />
                }
                onPress={() =>
                  router.push(
                    `/landlord-details?landlord_id=${landlord.landlord_id}`,
                  )
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
