import { Stack } from "expo-router";

export default function ChatLayout() {
    return (
        <Stack>

            <Stack.Screen name="call" options={{ headerShown: false }} />
            <Stack.Screen name="chat-room/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="chat-list/index" options={{ headerShown: false }} />
        </Stack>
    );
}
