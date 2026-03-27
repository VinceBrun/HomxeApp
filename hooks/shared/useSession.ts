import { useSession as useSessionFromProvider } from "@/providers/session";

/**
 * Provides the current authenticated session (persisted across app restarts).
 */

export default function useSession() {
  return useSessionFromProvider();
}
