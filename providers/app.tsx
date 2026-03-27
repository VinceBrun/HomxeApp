/**
 * App Provider
 * Root wrapper that composes all global providers (Auth, Theme, Query, UI).
 */

import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from './session';

const queryClient = new QueryClient();

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <PaperProvider>
            <SafeAreaProvider>
              <SessionProvider>{children}</SessionProvider>
            </SafeAreaProvider>
          </PaperProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default AppProvider;
