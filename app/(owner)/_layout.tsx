/**
 * Owner Layout
 * Wraps owner routes with PropertyCreateContext for property creation flow
 */

import { PropertyCreateProvider } from "@/features/owner/property-create/context/PropertyCreateContext";
import { Stack } from "expo-router";

export default function OwnerLayout() {
  return (
    <PropertyCreateProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PropertyCreateProvider>
  );
}
