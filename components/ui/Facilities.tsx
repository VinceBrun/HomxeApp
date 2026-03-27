import React from "react";
import { View, Text } from "react-native";
import { Feather, MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";

interface FacilityItemProps {
  icon: { library: string; name: string };
  name: string;
  distance: string;
}

const iconMap: Record<string, any> = {
  Feather,
  MaterialIcons,
  FontAwesome,
  Ionicons,
};

const FacilityItem: React.FC<FacilityItemProps> = ({ icon, name, distance }) => {
  const IconComponent = iconMap[icon.library] || Feather;

  return (
    <View className="flex-row items-center w-1/2 mb-4">
      <IconComponent name={icon.name} size={24} color="#4B5563" />
      <View className="ml-2">
        <Text className="text-sm font-medium text-black">{name}</Text>
        <Text className="text-xs text-gray-500">{distance}</Text>
      </View>
    </View>
  );
};

export default FacilityItem;
