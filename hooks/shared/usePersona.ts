/**
 * Persona Hook
 * Manages user roles (Owner, Seeker, Artisan) and switching logic.
 */

import { useSession } from '@/providers/session';

export function usePersona() {
  const { activePersona, allPersonas, switchPersona, refetchPersonas } = useSession();

  return {
    activePersona,   // Current role
    allPersonas,      // Available roles
    switchPersona,    // Role switcher
    refetchPersonas,  // Refresh roles from server
    hasPersona: activePersona !== null,
    personaType: activePersona?.type || null,
  };
}
