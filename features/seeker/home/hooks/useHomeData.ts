/**
 * Seeker Home Data Hook
 * Orchestrates fetching of location, featured, nearby, and popular properties.
 */

import { useLocation } from "@/hooks/useLocation";
import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { PROPERTY_TYPES } from "../constants";

export const useHomeData = () => {
  const { profile } = useProfile();
  const { getCurrentLocationWithAddress, calculateDistance, currentLocation } =
    useLocation();

  const userName = profile?.full_name?.split(" ")[0] || "There";

  // --- UI State ---
  const [selectedType, setSelectedType] = useState<string>(PROPERTY_TYPES[0]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [nearbyProperties, setNearbyProperties] = useState<Property[]>([]);
  const [popularProperties, setPopularProperties] = useState<Property[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [locationText, setLocationText] = useState("Getting location...");

  // Fetches and formats user's current location
  const fetchUserLocation = useCallback(async () => {
    try {
      const userLocation = await getCurrentLocationWithAddress();
      if (userLocation?.address) {
        const parts = userLocation.address.split(",");
        const area = parts[0]?.trim() || "Unknown Area";
        const city = parts[1]?.trim() || "Unknown City";
        setLocationText(`${area}, ${city}`);
      } else {
        setLocationText("Port Harcourt, Rivers");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationText("Port Harcourt, Rivers");
    }
  }, [getCurrentLocationWithAddress]);

  // Fetches properties filtered by selected category
  const fetchFeaturedProperties = useCallback(async () => {
    try {
      const selectedTypeLower = selectedType.toLowerCase();
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "listed")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      if (!data) return setFeaturedProperties([]);

      const filtered = data
        .filter(p => p.category?.toLowerCase() === selectedTypeLower || p.type?.toLowerCase() === selectedTypeLower)
        .slice(0, 5);

      setFeaturedProperties(filtered);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      setFeaturedProperties([]);
    }
  }, [selectedType]);

  // Fetches properties within a 20km radius
  const fetchNearbyProperties = useCallback(async () => {
    try {
      if (!currentLocation) return setNearbyProperties([]);

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "listed")
        .not("latitude", "is", null)
        .not("longitude", "is", null);

      if (error) throw error;
      if (!data) return setNearbyProperties([]);

      const RADIUS_KM = 20;
      const nearby = data
        .map(p => ({ ...p, distance: calculateDistance(currentLocation.latitude, currentLocation.longitude, p.latitude!, p.longitude!) }))
        .filter(p => p.distance <= RADIUS_KM)
        .sort((a, b) => a.distance - b.distance);

      setNearbyProperties(nearby.slice(0, 10));
    } catch (error) {
      console.error("Error fetching nearby properties:", error);
      setNearbyProperties([]);
    }
  }, [currentLocation, calculateDistance]);

  // Fetches trending properties from the last 7 days
  const fetchPopularProperties = useCallback(async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "listed")
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("views_count", { ascending: false })
        .limit(10);

      if (error) throw error;
      setPopularProperties(data || []);
    } catch (error) {
      console.error("Error fetching popular properties:", error);
      setPopularProperties([]);
    }
  }, []);

  const fetchAllProperties = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchFeaturedProperties(), fetchNearbyProperties(), fetchPopularProperties()]);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchFeaturedProperties, fetchNearbyProperties, fetchPopularProperties]);

  useEffect(() => { fetchUserLocation(); }, [fetchUserLocation]);
  useEffect(() => { fetchAllProperties(); }, [fetchAllProperties]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllProperties();
    setRefreshing(false);
  }, [fetchAllProperties]);

  return {
    userName, locationText, selectedType, setSelectedType,
    featuredProperties, nearbyProperties, popularProperties,
    loading, refreshing, onRefresh,
  };
};
