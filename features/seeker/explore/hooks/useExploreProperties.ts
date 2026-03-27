/**
 * Seeker Explore Hook
 * Manages map state, location tracking, and property discovery logic.
 */

import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert } from "react-native";
import MapView from "react-native-maps";
import {
  ExploreProperty,
  SortOption,
  UserLocation,
} from "../types/explore.types";

export const useExploreProperties = () => {
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { profile } = useProfile();
  const user = profile;

  // UI & Data State
  const [properties, setProperties] = useState<ExploreProperty[]>([]);
  const [selectedProperty, setSelectedProperty] =
    useState<ExploreProperty | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("distance");
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Requests GPS permissions and centers map on user
  const getUserLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location Required", "Showing default location.");
        setUserLocation({ latitude: 4.8156, longitude: 7.0498 });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setUserLocation(coords);
      mapRef.current?.animateToRegion({
        ...coords,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch {
      setUserLocation({ latitude: 4.8156, longitude: 7.0498 });
    }
  }, []);

  // Haversine formula for coordinate distance
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // Fetches properties and syncs with user favorites
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      let savedIds = new Set<string>();
      if (user) {
        const { data } = await supabase
          .from("saved_properties")
          .select("property_id")
          .eq("tenant_id", user.id);
        savedIds = new Set(data?.map((s) => s.property_id) || []);
        setFavorites(savedIds);
      }

      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "listed");
      if (data) {
        const valid = data.map((p) => ({
          ...p,
          size: p.square_feet,
          image: p.images?.[0] || null,
          rating: 4.5,
          isFavorite: savedIds.has(p.id),
          distance: userLocation
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                p.latitude!,
                p.longitude!,
              )
            : undefined,
        })) as ExploreProperty[];
        setProperties(valid);
        if (valid.length > 0 && !selectedProperty)
          setSelectedProperty(valid[0]);
      }
    } catch (error) {
      console.error("Fetch properties error:", error);
    } finally {
      setLoading(false);
    }
  }, [userLocation, user, selectedProperty]);

  // Filters and sorts properties based on UI state
  const sortedProperties = useMemo(() => {
    let sorted = [...properties];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      sorted = sorted.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }
    switch (sortBy) {
      case "distance":
        sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case "price_low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
    }
    return sorted;
  }, [properties, searchQuery, sortBy]);

  // Toggle property favorite status
  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      if (!user) return;

      const isFavorited = favorites.has(propertyId);

      // Optimistic update
      setFavorites((prev) => {
        const newFavorites = new Set(prev);
        if (isFavorited) {
          newFavorites.delete(propertyId);
        } else {
          newFavorites.add(propertyId);
        }
        return newFavorites;
      });

      setProperties((prev) =>
        prev.map((p) =>
          p.id === propertyId ? { ...p, isFavorite: !isFavorited } : p,
        ),
      );

      // Database update
      try {
        if (isFavorited) {
          await supabase
            .from("saved_properties")
            .delete()
            .match({ property_id: propertyId, tenant_id: user.id });
        } else {
          await supabase
            .from("saved_properties")
            .insert({ property_id: propertyId, tenant_id: user.id });
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    [favorites, user],
  );

  const centerOnUserLocation = useCallback(async () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } else {
      await getUserLocation();
    }
  }, [userLocation, getUserLocation]);

  const handleMarkerPress = useCallback((property: ExploreProperty) => {
    setSelectedProperty(property);
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  // Initial load
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  useEffect(() => {
    if (userLocation) {
      fetchProperties();
    }
  }, [userLocation, fetchProperties]);

  return {
    mapRef,
    bottomSheetRef,
    properties: sortedProperties,
    selectedProperty,
    setSelectedProperty,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    loading,
    userLocation,
    toggleFavorite,
    centerOnUserLocation,
    handleMarkerPress,
  };
};
