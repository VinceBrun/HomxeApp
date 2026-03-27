import { Stack } from "expo-router";

export default function ScreensLayout() {
    return (
        <Stack>
            <Stack.Screen name="apartment-specifications" options={{ headerShown: false }} />
            <Stack.Screen name="enable-location" options={{ headerShown: false }} />
            <Stack.Screen name="payments" options={{ headerShown: false }} />
            <Stack.Screen name="verification" options={{ headerShown: false }} />
            <Stack.Screen name="bookings" options={{ headerShown: false }} />
            <Stack.Screen name="complaints-issues" options={{ headerShown: false }} />
            <Stack.Screen name="ratings-review" options={{ headerShown: false }} />
        </Stack>
    );
}
