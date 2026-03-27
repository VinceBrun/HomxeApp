import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CallScreen: React.FC = () => {
  const background = useThemeColor({}, 'background');
  const primaryText = useThemeColor({}, 'text');
  const secondaryText = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'outlineBorder');
  const endCallBg = useThemeColor({}, 'primary');
  const endCallIconColor = useThemeColor({}, 'card');

  const actions = [
    { icon: require('@/assets/icons/calloptions.png'), onPress: () => console.log('Add pressed') },
    { icon: require('@/assets/icons/mutecall.png'), onPress: () => console.log('Mute pressed') },
    { icon: require('@/assets/icons/speaker.png'), onPress: () => console.log('Speaker pressed') },
    { icon: require('@/assets/icons/videocall.png'), onPress: () => console.log('Video pressed') },
  ];

  const endCall = {
    icon: require('@/assets/icons/endcall.png'),
    onPress: () => console.log('End call pressed'),
  };

  return (
    <SafeAreaView className="flex-1 mt-4" style={{ backgroundColor: background }}>
      <View className="pl-4 pt-8">
        <Text className="text-2xl font-poppinsSemibold" style={{ color: primaryText }}>
          Daniel John
        </Text>
        <Text className="text-sm font-poppinsLight" style={{ color: secondaryText }}>
          04:00
        </Text>
      </View>

      <View className="flex items-center justify-center mt-10">
        <Image
          source={require('@/assets/images/callProfile.png')}
          className="w-60 h-60 rounded-full"
        />
      </View>

      <View className="flex items-center mt-12">
        <View className="flex-row justify-center space-x-8 mb-8">
          {actions.map((action, index) => (
            <Pressable
              key={index}
              onPress={action.onPress}
              className="w-16 h-16 rounded-full justify-center items-center"
              style={{ borderWidth: 1, borderColor }}
            >
              <Image source={action.icon} className="w-8 h-8" />
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={endCall.onPress}
          className="w-20 h-20 rounded-full justify-center items-center"
          style={{ backgroundColor: endCallBg }}
        >
          <Image
            source={endCall.icon}
            className="w-8 h-8"
            style={{ tintColor: endCallIconColor }}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default CallScreen;
