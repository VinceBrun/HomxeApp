/**
 * Details Layout
 * Navigation stack for detail screens (landlords, properties, cart, support)
 */

import { Stack } from "expo-router";

export default function DetailsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="top-landlords-details"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="landlord-details" options={{ headerShown: false }} />
      <Stack.Screen
        name="contact-landlords-options"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="properties-details"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="cart-details" options={{ headerShown: false }} />
      <Stack.Screen name="support" options={{ headerShown: false }} />
    </Stack>
  );
}
