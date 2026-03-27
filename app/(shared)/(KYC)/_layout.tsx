import { Stack } from "expo-router";

export default function DetailsLayout() {
    return (
        <Stack>
            <Stack.Screen name="kyc" options={{ headerShown: false }} />
            <Stack.Screen name="lets-get-to-know-you" options={{ headerShown: false }} />
            <Stack.Screen name="upload-id" options={{ headerShown: false }} />
            <Stack.Screen name="take-selfie" options={{ headerShown: false }} />
            <Stack.Screen name="completed" options={{ headerShown: false }} />
        </Stack>
    );
}
