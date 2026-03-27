import React from 'react';
import { View, Pressable, Text } from 'react-native';

type ToggleButtonProps = {
    leftLabel: string;
    rightLabel: string;
    active: 'listings' | 'sold';
    setActive: (tab: 'listings' | 'sold') => void;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({ leftLabel, rightLabel, active, setActive }) => {
    return (
        <View className='flex-row justify-between mt-6 bg-gray-200 rounded-lg p-2'>
            <Pressable
                onPress={() => setActive('listings')}
                className={`flex-1 items-center p-2 rounded-lg ${active === 'listings' ? 'bg-white' : ''}`}
            >
                <Text className={`font-semibold ${active === 'listings' ? 'text-black' : 'text-gray-600'}`}>
                    {leftLabel}
                </Text>
            </Pressable>
            <Pressable
                onPress={() => setActive('sold')}
                className={`flex-1 items-center p-2 rounded-lg ${active === 'sold' ? 'bg-white' : ''}`}
            >
                <Text className={`font-semibold ${active === 'sold' ? 'text-black' : 'text-gray-600'}`}>
                    {rightLabel}
                </Text>
            </Pressable>
        </View>
    );
};

export default ToggleButton;
