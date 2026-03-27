import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

type ChatItemProps = {
    profileImage: any;
    userName: string;
    lastMessage: string;
    time: string;
    unreadCount?: number;
    onPress: () => void;
};

const ChatItem: React.FC<ChatItemProps> = ({ profileImage, userName, lastMessage, time, unreadCount, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} className='flex-row items-center p-4 border-b border-gray-200'>
            <Image source={profileImage} className='w-12 h-12 rounded-full' />
            <View className='flex-1 ml-4'>
                <Text className='text-base text-[#1A1E25] font-poppinsSemibold'>{userName}</Text>
                <Text className='text-sm text-gray-500 font-poppins'>{lastMessage}</Text>
            </View>
            <View className='items-end'>
                <Text className='text-xs text-gray-400 font-poppins'>{time}</Text>
                {unreadCount && (
                    <View className='bg-[#02311F] w-5 h-5 rounded-full justify-center items-center mt-1'>
                        <Text className='text-white text-xs font-poppins'>{unreadCount}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

export default ChatItem;
