/**
 * Profile Service
 * Manages user profile data in the 'profiles' table.
 */

import { TABLE_NAMES } from "@/constants/TABLE_NAMES";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types";

// Fetches application-specific user profile
export const fetchUserProfile = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from(TABLE_NAMES.profiles)
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

// Updates user profile with partial data
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<Profile, "id" | "created_at" | "updated_at">>,
): Promise<Profile> => {
  const { data, error } = await supabase
    .from(TABLE_NAMES.profiles)
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};
