import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
      <Stack.Screen
        name="email-verification"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="password-change-successful"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="email-verification-successful"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="biometrics-screen" options={{ headerShown: false }} />
      <Stack.Screen name="choose-persona" options={{ headerShown: false }} />
      <Stack.Screen name="auth-hub" options={{ headerShown: false }} />
      <Stack.Screen name="enable-location" options={{ headerShown: false }} />
    </Stack>
  );
}
