/**
 * Location Hook
 * Manages device location permissions and retrieves current GPS coordinates.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

const LOCATION_ENABLED_KEY = "@location_enabled";

export interface LocationStatus {
  isGranted: boolean;
  isEnabled: boolean;
  canAskAgain: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  address?: string;
}

export const useLocation = () => {
  const [status, setStatus] = useState<LocationStatus>({
    isGranted: false,
    isEnabled: false,
    canAskAgain: true,
  });
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  /**
   * Check current location permission status
   */
  const checkLocationPermission = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status: permissionStatus, canAskAgain } =
        await Location.getForegroundPermissionsAsync();

      // Check if user previously enabled location
      const enabled = await AsyncStorage.getItem(LOCATION_ENABLED_KEY);

      setStatus({
        isGranted: permissionStatus === "granted",
        isEnabled: enabled === "true",
        canAskAgain,
      });
    } catch (error) {
      console.error("Error checking location permission:", error);
      setStatus({
        isGranted: false,
        isEnabled: false,
        canAskAgain: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check location permissions on mount
  useEffect(() => {
    checkLocationPermission();
  }, [checkLocationPermission]);

  /**
   * Request location permission from user
   */
  const requestLocationPermission = useCallback(async (): Promise<boolean> => {
    try {
      // First check current status
      const { status: currentStatus, canAskAgain } =
        await Location.getForegroundPermissionsAsync();

      // If already granted, just enable and return
      if (currentStatus === "granted") {
        await AsyncStorage.setItem(LOCATION_ENABLED_KEY, "true");
        setStatus({
          isGranted: true,
          isEnabled: true,
          canAskAgain: true,
        });
        return true;
      }

      // If permission was denied and we can't ask again, show settings alert
      if (currentStatus === "denied" && !canAskAgain) {
        Alert.alert(
          "Location Permission Denied",
          "Please enable location access in your device settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return false;
      }

      // Request permission
      const { status: newStatus, canAskAgain: canAsk } =
        await Location.requestForegroundPermissionsAsync();

      const granted = newStatus === "granted";

      if (granted) {
        await AsyncStorage.setItem(LOCATION_ENABLED_KEY, "true");
      }

      setStatus({
        isGranted: granted,
        isEnabled: granted,
        canAskAgain: canAsk,
      });

      if (!granted) {
        Alert.alert(
          "Permission Required",
          "Location access is needed to show you nearby properties and services.",
          [{ text: "OK" }],
        );
      }

      return granted;
    } catch (error) {
      console.error("Error requesting location permission:", error);
      Alert.alert(
        "Error",
        "Failed to request location permission. Please try again.",
        [{ text: "OK" }],
      );
      return false;
    }
  }, []);

  /**
   * Get user's current location
   */
  const getCurrentLocation =
    useCallback(async (): Promise<UserLocation | null> => {
      setIsFetchingLocation(true);
      try {
        // Check if we have permission
        if (!status.isGranted) {
          const granted = await requestLocationPermission();
          if (!granted) {
            setIsFetchingLocation(false);
            return null;
          }
        }

        // Get current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const userLocation: UserLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        };

        setCurrentLocation(userLocation);
        return userLocation;
      } catch (error) {
        console.error("Error getting current location:", error);
        Alert.alert(
          "Location Error",
          "Failed to get your current location. Please try again.",
          [{ text: "OK" }],
        );
        return null;
      } finally {
        setIsFetchingLocation(false);
      }
    }, [status.isGranted, requestLocationPermission]);

  /**
   * Get address from coordinates (reverse geocoding)
   */
  const getAddressFromCoordinates = useCallback(
    async (latitude: number, longitude: number): Promise<string | null> => {
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (addresses && addresses.length > 0) {
          const address = addresses[0];
          const parts = [
            address.street,
            address.city,
            address.region,
            address.country,
          ].filter(Boolean);

          return parts.join(", ");
        }

        return null;
      } catch (error) {
        console.error("Error getting address:", error);
        return null;
      }
    },
    [],
  );

  /**
   * Get current location with address
   */
  const getCurrentLocationWithAddress =
    useCallback(async (): Promise<UserLocation | null> => {
      const location = await getCurrentLocation();

      if (location) {
        const address = await getAddressFromCoordinates(
          location.latitude,
          location.longitude,
        );

        return {
          ...location,
          address: address || undefined,
        };
      }

      return null;
    }, [getCurrentLocation, getAddressFromCoordinates]);

  /**
   * Disable location tracking
   */
  const disableLocation = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.setItem(LOCATION_ENABLED_KEY, "false");
      setStatus((prev) => ({ ...prev, isEnabled: false }));
      setCurrentLocation(null);
    } catch (error) {
      console.error("Error disabling location:", error);
    }
  }, []);

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number): number => {
      const R = 6371; // Earth's radius in kilometers
      const toRad = (value: number) => (value * Math.PI) / 180;

      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance;
    },
    [],
  );

  return useMemo(
    () => ({
      status,
      currentLocation,
      isLoading,
      isFetchingLocation,
      checkLocationPermission,
      requestLocationPermission,
      getCurrentLocation,
      getCurrentLocationWithAddress,
      getAddressFromCoordinates,
      disableLocation,
      calculateDistance,
    }),
    [
      status,
      currentLocation,
      isLoading,
      isFetchingLocation,
      checkLocationPermission,
      requestLocationPermission,
      getCurrentLocation,
      getCurrentLocationWithAddress,
      getAddressFromCoordinates,
      disableLocation,
      calculateDistance,
    ],
  );
};
