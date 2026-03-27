import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeStore = {
  colorScheme: ColorSchemeName;
  setColorScheme: (value: ColorSchemeName) => void;
  toggleColorScheme: () => void;
};

const useTheme = create<ThemeStore>()(
  persist(
    (set, get) => ({
      colorScheme: "light",

      setColorScheme: (value) => {
        const validScheme = value === "dark" ? "dark" : "light";
        return set({ colorScheme: validScheme });
      },

      toggleColorScheme: () => {
        const currentColorScheme = get().colorScheme;
        console.log({ currentColorScheme });
        return set({
          colorScheme: currentColorScheme === "dark" ? "light" : "dark",
        });
      },
    }),
    {
      name: "themestore",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          persistedState.colorScheme = persistedState.colorScheme || "light";
        }
        return persistedState;
      },
    },
  ),
);

export const useThemeStore = () => {
  const systemColorTheme = useColorScheme();
  const { colorScheme, setColorScheme } = useTheme((state) => state);

  useEffect(() => {
    if (colorScheme !== "light" && colorScheme !== "dark") {
      setColorScheme(systemColorTheme || "light");
    }
  }, [systemColorTheme, colorScheme, setColorScheme]);

  return useTheme((state) => state);
};

export default useTheme;
