import ReadonlyUserProfile from "@/components/ui/profile/ReadonlyUserProfile";
import { fetchUserProfile } from "@/services/profile";
import { Profile } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = { userId: string };
const ReadonlyUserProfileScreen: React.FC<Props> = ({ userId }) => {
  const getUserProfile = async (): Promise<Profile> => {
    const profile = await fetchUserProfile(userId);
    return profile;
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["get-user-profile", userId],
    queryFn: getUserProfile,
  });

  return (
    <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
      <ReadonlyUserProfile
        isLoading={isLoading}
        error={error}
        userProfile={data}
      />
    </SafeAreaView>
  );
};

export default ReadonlyUserProfileScreen;
