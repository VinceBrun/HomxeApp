/**
 * Amenity Item Component
 * Simple row display for a single property feature with icon and label.
 */

import { View, Text, Image } from "react-native";

interface AmenityProps {
    name: string;
    icon: any;
}

const AmenityItem: React.FC<AmenityProps> = ({ name, icon }) => {
    return (
        <View className="flex-row items-center mb-3">
            <Image source={icon} className="w-6 h-6 mr-3" />
            <Text className="text-base font-medium text-black">{name}</Text>
        </View>
    );
};

export default AmenityItem;
