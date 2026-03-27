// hooks/useColorScheme.ts

import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * SSR-safe custom color scheme hook.
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const colorScheme = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated ? colorScheme : 'light';
}
