import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function SharedChatThread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Chat Thread: {id}</Text>
    </View>
  );
}
