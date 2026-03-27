import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack> 
            <Stack.Screen name="user-profile" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ headerShown: false }} />
            <Stack.Screen name="profile-details-screen" options={{ headerShown: false }} />
        </Stack>
    );
}
