import React from 'react';
import { View, TextInput, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type MessageInputProps = {
    onPlusPress: () => void;
    onVoicePress: () => void;
    onSend: (message: string) => void;
};

const MessageInput: React.FC<MessageInputProps> = ({ onPlusPress, onVoicePress, onSend }) => {
    const [message, setMessage] = React.useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <SafeAreaView className='flex-row items-center p-4 shadow-sm'>
            <Pressable onPress={onPlusPress}>
                <Image source={require('@/assets/icons/add-circle.png')} className='w-6 h-6' />
            </Pressable>
            <View className='flex-1 mx-4 flex-row items-center p-2 rounded-full border border-gray-300'>
                <Image source={require('@/assets/icons/chat.png')} className='w-5 h-5 mr-2' />
                <TextInput
                    placeholder='Type something...'
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleSend}
                    className='flex-1'
                />
                <Pressable onPress={onVoicePress}>
                    <Image source={require('@/assets/icons/arcticons_record-you.png')} className='w-6 h-6 ml-2' />
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default MessageInput;
