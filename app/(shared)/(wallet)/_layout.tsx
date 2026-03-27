import { Stack } from "expo-router";

export default function WalletLayout() {
    return (
        <Stack>
            <Stack.Screen name="wallet-landing-page" options={{ headerShown: false }} />
            <Stack.Screen name="wallet-payment-one" options={{ headerShown: false }} />
            <Stack.Screen name="wallet-payment-two" options={{ headerShown: false }} />
            <Stack.Screen name="wallet-payment-three" options={{ headerShown: false }} />
            <Stack.Screen name="wallet-payment-four" options={{ headerShown: false }} />
            <Stack.Screen name="payment-status" options={{ headerShown: false }} />
            <Stack.Screen name="payment-confirmation" options={{ headerShown: false }} />
        </Stack>
    );
}
