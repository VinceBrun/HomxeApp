import { Stack } from "expo-router";

export default function ScreensLayout() {
    return (
        <Stack>
            <Stack.Screen name="about-us" options={{ headerShown: false }} />
            <Stack.Screen name="change-password" options={{ headerShown: false }} />
            <Stack.Screen name="currency" options={{ headerShown: false }} />
            <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
            <Stack.Screen name="help-support" options={{ headerShown: false }} />
            <Stack.Screen name="language" options={{ headerShown: false }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
            <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
            <Stack.Screen name="security" options={{ headerShown: false }} />
        </Stack>
    );
}
