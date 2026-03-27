/**
 * Landlord Details Screen
 * Provides detailed information about a landlord, including their profile, 
 * current property listings, and past successful rentals.
 */

import Button from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/providers/session";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LandlordDetails = () => {
  const { landlord_id } = useLocalSearchParams<{ landlord_id: string }>();
  const user = useUser();
  const router = useRouter();

  const [landlord, setLandlord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "sold">("listings");
  const [listings, setListings] = useState<any[]>([]);
  const [sold, setSold] = useState<any[]>([]);

  const background = useThemeColor({}, "background");
  const primary = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const card = useThemeColor({}, "card");

  useEffect(() => {
    const fetchLandlord = async () => {
      if (!landlord_id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("top_landlords_with_email")
        .select("*")
        .eq("landlord_id", landlord_id)
        .single();
      if (!error && data) setLandlord(data);
      setLoading(false);
    };
    fetchLandlord();
  }, [landlord_id]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!landlord_id) return;
      setLoading(true);
      const { data: listed } = await supabase
        .from("properties")
        .select("*")
        .eq("landlord_id", landlord_id)
        .eq("status", "listed");

      const { data: soldData } = await supabase
        .from("properties")
        .select("*")
        .eq("landlord_id", landlord_id)
        .eq("status", "delisted");

      setListings(listed ?? []);
      setSold(soldData ?? []);
      setLoading(false);
    };
    fetchProperties();
  }, [landlord_id]);

  const displayedProperties = activeTab === "listings" ? listings : sold;

  const onSubmit = async () => {
    if (!user?.id || !landlord_id) return;
    try {
      const { data: existingChat } = await supabase
        .from("chats")
        .select("id")
        .eq("tenant_id", user.id)
        .eq("landlord_id", landlord_id)
        .single();

      let chatId = existingChat?.id;

      if (!chatId) {
        const { data: newChat, error: insertError } = await supabase
          .from("chats")
          .insert({ tenant_id: user.id, landlord_id })
          .select()
          .single();

        if (insertError || !newChat) {
          console.error("Failed to create chat:", insertError);
          return;
        }
        chatId = newChat.id;
      }

      router.push({
        pathname: "/chat-room/[id]",
        params: {
          id: chatId,
          participantId: landlord_id,
          displayName: landlord.full_name,
          avatarUrl: landlord.avatar_url ?? "",
        },
      });
    } catch (error) {
      console.error("Chat navigation failed:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: background }}
      >
        <ActivityIndicator size="large" color={primary} />
        <Text className="mt-4 text-base" style={{ color: muted }}>
          Loading landlord profile...
        </Text>
      </SafeAreaView>
    );
  }

  if (!landlord) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: background }}
      >
        <Text className="text-lg" style={{ color: primary }}>
          Landlord not found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 pt-4"
      style={{ backgroundColor: background }}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        className="p-4"
      >
        <View className="items-center mb-8">
          <Text
            className="text-2xl font-poppinsBold text-center"
            style={{ color: textColor }}
          >
            {landlord.full_name}
          </Text>
          <Text className="text-sm text-center" style={{ color: muted }}>
            {landlord.email}
          </Text>
          <Image
            source={
              landlord.avatar_url
                ? { uri: landlord.avatar_url }
                : require("@/assets/images/Andrew.png")
            }
            className="w-24 h-24 rounded-full mt-4"
          />
        </View>

        <View className="flex-row justify-between">
          <View
            className="rounded-lg p-4 shadow-sm items-center w-[30%]"
            style={{ backgroundColor: card }}
          >
            <Text
              className="text-2xl font-poppinsSemibold"
              style={{ color: textColor }}
            >
              {Number(landlord.average_rating || 0).toFixed(1)}
            </Text>
            <View className="flex-row mt-2">
              {[...Array(5)].map((_, i) => (
                <FontAwesome
                  key={i}
                  name="star"
                  size={14}
                  color="#fbbf24"
                  className="mr-1"
                />
              ))}
            </View>
          </View>

          <View
            className="rounded-lg p-4 shadow-sm items-center w-[30%]"
            style={{ backgroundColor: card }}
          >
            <Text
              className="text-2xl font-poppinsSemibold"
              style={{ color: textColor }}
            >
              {landlord.review_count || 0}
            </Text>
            <Text
              className="text-sm font-poppins mt-2"
              style={{ color: muted }}
            >
              Reviews
            </Text>
          </View>

          <View
            className="rounded-lg p-4 shadow-sm items-center w-[30%]"
            style={{ backgroundColor: card }}
          >
            <Text
              className="text-2xl font-poppinsSemibold"
              style={{ color: textColor }}
            >
              {landlord.num_properties || 0}
            </Text>
            <Text
              className="text-sm font-poppins mt-2"
              style={{ color: muted }}
            >
              Properties
            </Text>
          </View>
        </View>

        <View
          className="flex-row justify-between mt-6 rounded-lg p-2"
          style={{ backgroundColor: muted }}
        >
          {["listings", "sold"].map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab as "listings" | "sold")}
              className={`flex-1 items-center p-2 rounded-lg ${activeTab === tab ? "bg-white" : ""}`}
            >
              <Text
                className="font-poppinsMedium"
                style={{ color: activeTab === tab ? textColor : muted }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text
          className="text-xl font-poppinsSemibold mt-6"
          style={{ color: textColor }}
        >
          {activeTab === "listings"
            ? `${listings.length} Listings`
            : `${sold.length} Sold`}
        </Text>

        <View className="mt-4 flex-row flex-wrap justify-between">
          {displayedProperties.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => router.push(`/properties-details?id=${item.id}`)}
              className="rounded-lg p-4 mb-4 w-[48%] shadow-sm"
              style={{ backgroundColor: card }}
            >
              <View className="relative">
                <Image
                  source={
                    item.image_url
                      ? { uri: item.image_url }
                      : require("@/assets/images/glassHouse.png")
                  }
                  className="w-full h-40 rounded-lg"
                />
                <View
                  className="absolute bottom-2 right-2 px-2 py-1 rounded-lg"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <Text className="text-white font-poppins">
                    ${item.price}/month
                  </Text>
                </View>
              </View>
              <Text
                className="text-lg font-bold mt-2 truncate"
                style={{ color: textColor }}
              >
                {item.title}
              </Text>
              <View className="flex-row items-center mt-1 justify-between">
                <View className="flex-row items-center">
                  <FontAwesome
                    name="star"
                    size={14}
                    color="#fbbf24"
                    className="mr-1"
                  />
                  <Text
                    className="text-sm font-poppins"
                    style={{ color: textColor }}
                  >
                    {item.rating ?? "N/A"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={14} color={muted} />
                  <Text
                    className="text-sm font-poppins ml-1 truncate"
                    style={{ color: muted }}
                  >
                    {item.location}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{ backgroundColor: card }}
      >
        <Button title="Start Chat" handlePress={onSubmit} fullWidth />
      </View>
    </SafeAreaView>
  );
};

export default LandlordDetails;
