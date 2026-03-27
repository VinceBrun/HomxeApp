/**
 * @file Deep Linking Utility
 * @description Production-ready utility for managing cross-platform deep links.
 * Provides functionality for:
 * - Generating shareable web URLs for property listings.
 * - Generating internal app schemes for direct navigation.
 * - Native social sharing integration.
 * - Parsing incoming deep links to determine target routes.
 */

import { Property } from "@/types";
import * as Linking from "expo-linking";
import { Share } from "react-native";

/**
 * Global URL configuration for deep linking.
 * Update these constants when moving to a production domain.
 */
const APP_SCHEME = "homxe"; // Custom app scheme (homxe://)
const WEB_DOMAIN = "homxe.app"; // Registered web domain
const WEB_URL = `https://${WEB_DOMAIN}`;

/**
 * Generates a shareable HTTPS link for a property.
 * This URL acts as a fallback; if the app is installed, it can be intercepted.
 * @param propertyId - The unique UUID of the property.
 * @returns A full URL string (e.g., https://homxe.app/property/123).
 */
export function generatePropertyLink(propertyId: string): string {
  return `${WEB_URL}/property/${propertyId}`;
}

/**
 * Generates an internal app-scheme link for direct navigation.
 * @param propertyId - The unique UUID of the property.
 * @returns An internal URI (e.g., homxe://property/123).
 */
export function generateDeepLink(propertyId: string): string {
  return `${APP_SCHEME}://property/${propertyId}`;
}

/**
 * Triggers the native sharing sheet with formatted property details.
 * Optimizes the message content for WhatsApp and other social platforms.
 * @param property - The full property object to be shared.
 */
export async function shareProperty(property: Property): Promise<void> {
  try {
    const propertyLink = generatePropertyLink(property.id);

    // Build feature specification string (e.g., "3 bed • 2 bath")
    const specs = [];
    if (property.bedrooms) specs.push(`${property.bedrooms} bed`);
    if (property.bathrooms) specs.push(`${property.bathrooms} bath`);
    const specsText = specs.length > 0 ? ` • ${specs.join(" • ")}` : "";

    // Construct the share message
    const message = `Check out this ${property.type || "property"} in ${property.location}!

${property.title}
₦${property.price?.toLocaleString()}/mo${specsText}

View full details: ${propertyLink}`;

    const shareContent = {
      message: message,
      url: propertyLink, // Essential for iOS rich previews
      title: property.title || "Property on Homxe",
    };

    const result = await Share.share(shareContent);

    if (result.action === Share.sharedAction) {
      console.log("Property shared successfully");
      return;
    }

    console.log("Share dismissed");
  } catch (error) {
    console.error("Error sharing property:", error);
    throw error;
  }
}

/**
 * Parses an incoming URL into a structured navigation object.
 * Supports both custom schemes and web universal links.
 * @param url - The raw incoming URL string.
 * @returns A parsed object containing the target type and ID, or null if invalid.
 */
export function parseDeepLink(
  url: string,
): { type: string; id: string } | null {
  try {
    const { hostname, path, queryParams } = Linking.parse(url);

    console.log("Parsing deep link:", { hostname, path, queryParams });

    // Routing Logic: Handle property detail links
    if (path?.includes("property")) {
      const parts = path.split("/").filter(Boolean);
      const propertyIndex = parts.indexOf("property");

      if (propertyIndex !== -1 && parts[propertyIndex + 1]) {
        const propertyId = parts[propertyIndex + 1];
        return { type: "property", id: propertyId };
      }
    }

    return null;
  } catch (error) {
    console.error("Error parsing deep link:", error);
    return null;
  }
}

/**
 * Handle incoming deep link and navigate
 */
export async function handleIncomingLink(
  url: string,
  router: any,
): Promise<boolean> {
  try {
    console.log("🔗 Handling incoming link:", url);

    const parsed = parseDeepLink(url);

    if (!parsed) {
      console.log("Could not parse link");
      return false;
    }

    if (parsed.type === "property") {
      console.log("Navigating to property:", parsed.id);
      router.push(`/(seeker)/property/${parsed.id}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error handling incoming link:", error);
    return false;
  }
}

/**
 * Setup deep link listeners
 * Call this in your root _layout.tsx
 */
export function setupDeepLinking(router: any): () => void {
  // Handle links when app is already open
  const subscription = Linking.addEventListener("url", (event) => {
    handleIncomingLink(event.url, router);
  });

  // Handle link that opened the app
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleIncomingLink(url, router);
    }
  });

  // Cleanup function
  return () => {
    subscription.remove();
  };
}

/**
 * Generate Open Graph metadata for web landing page
 * Use this data to create property landing pages
 */
export function generateOGMetadata(property: Property) {
  return {
    title: `${property.title} - Homxe`,
    description: `₦${property.price?.toLocaleString()}/mo • ${property.bedrooms} bed • ${property.bathrooms} bath • ${property.location}`,
    image: property.images?.[0] || "",
    url: generatePropertyLink(property.id),
    type: "website",
    siteName: "Homxe - Find Your Perfect Home",
  };
}

/**
 * Example usage in _layout.tsx:
 *
 * import { setupDeepLinking } from '@/utils/deepLinking';
 *
 * useEffect(() => {
 *   const cleanup = setupDeepLinking(router);
 *   return cleanup;
 * }, []);
 */

/**
 * Example usage in property details:
 *
 * import { shareProperty } from '@/utils/deepLinking';
 *
 * const handleShare = async () => {
 *   try {
 *     await shareProperty(property);
 *   } catch (error) {
 *     Alert.alert('Error', 'Failed to share property');
 *   }
 * };
 */
