import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function SharedChatList() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Chats</Text>
      <Link href="/" asChild>
        <Pressable style={{ padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8 }}>
          <Text>Thread #1</Text>
        </Pressable>
      </Link>
    </View>
  );
}
