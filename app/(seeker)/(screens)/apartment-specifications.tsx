import Button from '@/components/ui/Button';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ApartmentSpecification = () => {
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const router = useRouter();

    const specifications = [
        { title: 'Number of Bedrooms', options: ['1', '2', '3', '4'] },
        { title: 'Number of Bathrooms', options: ['1', '2', '3', '4'] },
        { title: 'Floor Preference', options: ['Ground Floor', 'First Floor', 'Penthouse'] },
        { title: 'Furnishing Status', options: ['Furnished', 'Semi-furnished', 'Unfurnished'] },
        { title: 'Rent Budget', options: ['$500-$1000', '$1000-$1500', '$1500+'] },
        { title: 'Parking Availability', options: ['Yes', 'No'] },
        { title: 'Pet-Friendly', options: ['Yes', 'No'] },
        { title: 'Proximity to Transport', options: ['Near Subway', 'Near Bus Stop', 'Near Highway'] },
    ];

    const handleDropdownToggle = (index: number) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    return (
        <SafeAreaView className="flex-1 px-4 py-6 bg-white">
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => router.back()}>
                    <FontAwesome name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-2xl font-poppinsSemibold ml-4">Apartment Specification</Text>
            </View>

            <Text className="text-md text-gray-500 text-center font-poppins mb-6">
                Search for an apartment according to your preference. Landlords will be notified and reach out to you.
            </Text>

            <Text className="text-lg font-poppinsSemibold mb-4">What are you searching for?</Text>

            <ScrollView className="flex-1">
                {specifications.map((spec, index) => (
                    <View key={index} className="mb-4">
                        <TouchableOpacity
                            className="flex-row justify-between items-center p-4 border border-gray-300 rounded-md"
                            onPress={() => handleDropdownToggle(index)}
                        >
                            <Text className="text-lg text-gray-700 font-poppinsSemibold">{spec.title}</Text>
                            <FontAwesome
                                name={openDropdownIndex === index ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color="#888"
                            />
                        </TouchableOpacity>
                        {openDropdownIndex === index && (
                            <View className="mt-2 bg-gray-100 p-4 rounded-md">
                                {spec.options.map((option, optIndex) => (
                                    <Text key={optIndex} className="text-md text-gray-600 mb-2 font-poppins">
                                        {option}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            <View className="mt-6">
                <Button
                    title="Submit"
                    handlePress={() => console.log('Submit specifications')}
                    fullWidth
                />
            </View>
        </SafeAreaView>
    );
};

export default ApartmentSpecification;
