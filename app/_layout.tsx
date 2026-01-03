import { Stack } from "expo-router";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="explore" options={{ headerShown: true, headerBackButtonDisplayMode: "minimal", headerStyle: { backgroundColor: "#121212" }, headerTintColor: "white" }} />
      <Stack.Screen
        name="detail"
        options={{
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
          headerStyle: { backgroundColor: "#121212" },
          headerTintColor: "white",
        }}
      />
      <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
    </Stack>
  );
}
