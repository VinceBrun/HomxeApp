import React from 'react';
import { View, Text, Image } from 'react-native';

type RatingCardProps = {
    value: number;
    label: string;
};

const RatingCard: React.FC<RatingCardProps> = ({ value, label }) => {
    return (
        <View className='bg-white rounded-lg p-4 shadow-sm items-center w-[30%]'>
            <Text className='text-2xl font-bold'>{value}</Text>
            {label === "Rating" ? (
                <View className='flex-row mt-2'>
                    {[...Array(5)].map((_, index) => (
                        <Image key={index} source={require('@/assets/icons/starIcon.png')} className='w-4 h-4' />
                    ))}
                </View>
            ) : (
                <Text className='text-sm text-gray-600 font-poppins mt-2'>{label}</Text>
            )}
        </View>
    );
};

export default RatingCard;
