import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Text, View } from "react-native";

type MiniBookingCardProps = {
  title: string;
  reviews: number;
  owner: {
    avatar: string | null;
    name: string;
    role: string;
  };
};

const Review_Rating_Card: React.FC<MiniBookingCardProps> = ({
  title,
  reviews,
  owner,
}) => {
  return (
    <View className="bg-white rounded-xl shadow px-4 py-3 space-y-2">
      <View className="flex-row justify-between items-start">
        <Text className="text-lg font-semibold text-black flex-1">{title}</Text>
        <View className="items-end">
          <FontAwesome name="star" size={18} color="#fbbf24" />
          <Text className="text-xs text-gray-500">{reviews} reviews</Text>
        </View>
      </View>

      <View className="flex-row items-center mt-2">
        <Image
          source={{ uri: owner.avatar || "https://via.placeholder.com/40" }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View>
          <Text className="text-sm font-semibold text-black">{owner.name}</Text>
          <Text className="text-xs text-gray-500">{owner.role}</Text>
        </View>
      </View>
    </View>
  );
};

export default Review_Rating_Card;
