/**
 * Profile Hook
 * Wrapper for accessing and updating the current user's profile.
 */

import { fetchUserProfile, updateUserProfile } from "@/services/profile";
import { Profile } from "@/types";
import { useCallback, useEffect, useState } from "react";
import useSession from "./useSession";

const useProfile = () => {
  const [isGetProfileLoading, setIsGetProfileLoading] = useState(true);
  const [isUpdateProfileLoading, setIsUpdateProfileLoading] = useState(false);
  const [getProfileError, setGetProfileError] = useState<Error | null>(null);
  const [updateProfileError, setUpdateProfileError] = useState<Error | null>(null);

  const { user, profile, activePersona } = useSession();

  // Refetches profile data from DB
  const getProfile = useCallback(async () => {
    setIsGetProfileLoading(true);
    setGetProfileError(null);
    try {
      if (!user?.id) throw new Error("No user on the session!");
      return await fetchUserProfile(user.id);
    } catch (error) {
      setGetProfileError(error instanceof Error ? error : new Error("Failed to fetch profile."));
      return undefined;
    } finally {
      setIsGetProfileLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) setIsGetProfileLoading(false);
  }, [user]);

  // Updates profile fields (name, phone, avatar)
  const updateProfile = async (
    updates: Partial<{ full_name: string; phone_number: string; avatar_url: string | null }>,
    onSuccess?: () => void,
  ) => {
    setIsUpdateProfileLoading(true);
    setUpdateProfileError(null);
    try {
      if (!user?.id) throw new Error("No user on the session!");
      await updateUserProfile(user.id, updates);
      onSuccess?.();
    } catch (error) {
      console.error("Update Profile Error:", error);
      setUpdateProfileError(error instanceof Error ? error : new Error("Failed to update profile."));
    } finally {
      setIsUpdateProfileLoading(false);
    }
  };

  return {
    profile,
    activePersona,
    isGetProfileLoading,
    isUpdateProfileLoading,
    getProfileError,
    updateProfileError,
    updateProfile,
    refetch: getProfile,
  };
};

export default useProfile;
export type { Profile };

