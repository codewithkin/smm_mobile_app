// Animation
import "react-native-reanimated";
import "react-native-gesture-handler";

import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import ToastManager from "toastify-react-native";
import { colors } from "../constants/colors";
import OfflineWrapper from "@/screens/NetWrapper";
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform, Alert } from "react-native";
import axios from "axios"; // or use fetch
import { storage } from "@/lib/mmkv-storage";
import { urls } from "@/constants/urls";

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

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  useEffect(() => {
    const username = storage.getString("user.username");

    const getPushToken = async () => {
      // Request permission to show notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Push notification permission is required.",
        );
        return;
      }

      // Get the Expo push token
      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data); // Save the push token
      console.log("Expo Push Token:", token.data);

      // Send the token to the backend
      if (token.data) {
        try {
          await axios.post(`${urls.backendUrl}/auth/save-push-token`, {
            token: token.data,
            username,
          });
          console.log("Push token saved successfully");
        } catch (error) {
          console.error("Error sending push token to backend:", error);
        }
      }
    };

    if (username) {
      getPushToken();
    }

    // This will listen for incoming push notifications
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        // Handle notification here (e.g., show alert, navigate, etc.)
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <OfflineWrapper>
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
    </OfflineWrapper>
  );
}
