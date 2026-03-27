// hooks/useTransientSession.ts
import { useSession } from "@/providers/session";

/**
 * Alias for `useSession`, intended for usage during transient flows
 * like splash screens, login/signup, or redirects.
 */
export default function useTransientSession() {
  return useSession();
}
