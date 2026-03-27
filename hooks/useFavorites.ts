import { supabase } from "@/lib/supabase";
import { useSession } from "@/providers/session";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

/**
 * Hook for managing property favorites
 * Handles saving/unsaving properties and checking saved status
 */
export function useFavorites() {
  const { user } = useSession();
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch user's saved properties on mount
  const fetchSavedProperties = useCallback(async () => {
    if (!user?.id) {
      setSavedPropertyIds([]);
      setInitialLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("saved_properties")
        .select("property_id")
        .eq("tenant_id", user.id);

      if (error) {
        console.error("Error fetching saved properties:", error);
        return;
      }

      const propertyIds = data?.map((item) => item.property_id) || [];
      setSavedPropertyIds(propertyIds);
      console.log("✅ Loaded saved properties:", propertyIds.length);
    } catch (err) {
      console.error("Error in fetchSavedProperties:", err);
    } finally {
      setInitialLoading(false);
    }
  }, [user?.id]);

  // Load saved properties on mount
  useEffect(() => {
    fetchSavedProperties();
  }, [fetchSavedProperties]);

  /**
   * Check if a property is saved
   */
  const isSaved = useCallback(
    (propertyId: string): boolean => {
      return savedPropertyIds.includes(propertyId);
    },
    [savedPropertyIds],
  );

  /**
   * Toggle save/unsave a property
   */
  const toggleSave = useCallback(
    async (propertyId: string) => {
      if (!user?.id) {
        Alert.alert(
          "Sign In Required",
          "Please sign in to save properties to your favorites.",
          [{ text: "OK" }],
        );
        return;
      }

      setLoading(true);

      try {
        const isCurrentlySaved = isSaved(propertyId);

        if (isCurrentlySaved) {
          // Unsave - delete from database
          const { error } = await supabase
            .from("saved_properties")
            .delete()
            .match({
              tenant_id: user.id,
              property_id: propertyId,
            });

          if (error) throw error;

          // Update local state
          setSavedPropertyIds((prev) => prev.filter((id) => id !== propertyId));
          console.log("❌ Removed from favorites:", propertyId);
        } else {
          // Save - insert into database
          const { error } = await supabase.from("saved_properties").insert({
            tenant_id: user.id,
            property_id: propertyId,
          });

          if (error) throw error;

          // Update local state
          setSavedPropertyIds((prev) => [...prev, propertyId]);
          console.log("✅ Added to favorites:", propertyId);
        }
      } catch (error: any) {
        console.error("Error toggling favorite:", error);
        Alert.alert(
          "Error",
          error.message || "Failed to update favorites. Please try again.",
          [{ text: "OK" }],
        );
      } finally {
        setLoading(false);
      }
    },
    [user?.id, isSaved],
  );

  /**
   * Save a property (explicit save, no toggle)
   */
  const saveProperty = useCallback(
    async (propertyId: string) => {
      if (isSaved(propertyId)) return; // Already saved
      await toggleSave(propertyId);
    },
    [isSaved, toggleSave],
  );

  /**
   * Unsave a property (explicit unsave, no toggle)
   */
  const unsaveProperty = useCallback(
    async (propertyId: string) => {
      if (!isSaved(propertyId)) return; // Not saved
      await toggleSave(propertyId);
    },
    [isSaved, toggleSave],
  );

  return {
    savedPropertyIds,
    isSaved,
    toggleSave,
    saveProperty,
    unsaveProperty,
    loading,
    initialLoading,
    refetch: fetchSavedProperties,
  };
}
