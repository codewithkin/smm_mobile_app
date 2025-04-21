// Animation
import "react-native-reanimated";
import "react-native-gesture-handler";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import ToastManager from "toastify-react-native";
import { colors } from "../constants/colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: "#ffffff",
    surface: "#ffffff",
    text: "#000000",
  },
};

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={lightTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="new/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="receipts/new/index"
          options={{ headerShown: true, headerTitle: "Add a new receipt" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <ToastManager />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}
