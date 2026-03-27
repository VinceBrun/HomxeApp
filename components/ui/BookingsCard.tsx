import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type BookingCardProps = {
  date: string;
  title: string;
  reviews: number;
  location: string;
  owner: {
    avatar: string | null;
    name: string;
    role: string;
  };
  price: string;
};

const BookingCard: React.FC<BookingCardProps> = ({
  date,
  title,
  reviews,
  location,
  owner,
  price,
}) => {
  const router = useRouter();

  return (
    <View className="bg-white rounded-xl shadow px-4 py-2 space-y-2">
      <Text className="text-sm text-gray-500">{date}</Text>

      <View className="flex-row justify-between items-start">
        <Text className="text-lg font-semibold text-black flex-1">{title}</Text>
        <View className="items-end">
          <FontAwesome name="star" size={18} color="#fbbf24" />
          <Text className="text-xs text-gray-500">{reviews} reviews</Text>
        </View>
      </View>

      <View className="flex-row items-center">
        <Ionicons name="location-outline" size={16} color="#6b7280" />
        <Text className="text-sm text-gray-600 ml-1">{location}</Text>
      </View>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Image
            source={{ uri: owner.avatar || "https://via.placeholder.com/40" }}
            className="w-10 h-10 rounded-full mr-3"
          />
          <View>
            <Text className="text-sm font-semibold text-black">
              {owner.name}
            </Text>
            <Text className="text-xs text-gray-500">{owner.role}</Text>
          </View>
        </View>
        <Text className="text-base font-bold text-black">{price}</Text>
      </View>

      <View className="flex-row justify-center space-x-4 mt-2">
        <TouchableOpacity
          className="px-4 py-2 bg-[#196606] rounded-lg"
          onPress={() => router.push("/ratings-review")}
        >
          <Text className="text-sm font-medium text-white">Leave a Review</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 bg-red-100 rounded-lg"
          onPress={() => router.push("/complaints-issues")}
        >
          <Text className="text-sm font-medium text-red-600">
            Report an Issue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingCard;
