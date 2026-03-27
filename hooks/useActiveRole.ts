import { useUserStore } from "@/store/user.store";
import type { Role } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const allowedRoles: Role[] = ["seeker", "owner", "artisan"];

export const useActiveRole = (): Role | undefined => {
  const { profile } = useUserStore();
  const [role, setRole] = useState<Role | undefined>();

  useEffect(() => {
    const resolve = async () => {
      const stored = await AsyncStorage.getItem("currentRole");
      const active = stored as Role | null;

      if (active && profile?.role?.includes(active)) {
        setRole(active);
      } else {
        const fallback = profile?.role?.find((r): r is Role =>
          allowedRoles.includes(r as Role),
        );
        setRole(fallback);
      }
    };
    resolve();
  }, [profile?.role]);

  return role;
};
