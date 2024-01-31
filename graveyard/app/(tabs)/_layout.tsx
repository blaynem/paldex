import React from "react";
import { Tabs } from "expo-router";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { FontAwesomeIcon } from "@/utils/utils";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "PALDEX",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="paw" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="BreedingCalculator"
        options={{
          title: "Breeding Calculator",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ItemsScreen"
        options={{
          title: "Items",
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon name="list" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
