import React from 'react';
import { Pressable, Text } from 'react-native';

type CustomButtonProps = {
    text: string;
    onPress: () => void;
    className?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({ text, onPress, className }) => {
    return (
        <Pressable onPress={onPress} className={`bg-[#02311F] rounded-md p-4 ${className}`}>
            <Text className='text-white text-center text-lg'>{text}</Text>
        </Pressable>
    );
};

export default CustomButton;
