import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';

type Landlord = {
  rank: number;
  image: any;
  name: string;
  rating: number;
  houseCount: number;
};

type LandlordCardProps = {
  landlord: Landlord;
  starIcon: JSX.Element;   
  houseIcon: JSX.Element;
  onPress?: () => void;
};

const LandlordCard: React.FC<LandlordCardProps> = ({
  landlord,
  starIcon,
  houseIcon,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-4 w-[48%] shadow-sm"
    >
      <View className="absolute top-2 left-2 bg-primary px-2 py-1 rounded-lg">
        <Text className="text-sm font-poppinsBold text-white">#{landlord.rank}</Text>
      </View>

      <Image
        source={landlord.image}
        className="w-16 h-16 rounded-full mx-auto mt-4"
      />

      <Text className="text-lg font-poppinsSemibold text-center text-[#252B5C] mt-2">
        {landlord.name}
      </Text>

      <View className="flex-row justify-center items-center mt-2 space-x-4">
        <View className="flex-row items-center">
          {starIcon}
          <Text className="text-sm font-poppinsSemibold ml-1">{landlord.rating}</Text>
        </View>
        <View className="flex-row items-center">
          {houseIcon}
          <Text className="text-sm font-poppinsSemibold ml-1">{landlord.houseCount}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default LandlordCard;
