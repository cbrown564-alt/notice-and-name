import { colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

function TabBarIcon({
  name,
  focusedName,
  color,
  size = 26,
  focused
}: {
  name: keyof typeof Ionicons.glyphMap;
  focusedName: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
  focused: boolean;
}) {
  return (
    <Ionicons
      name={focused ? focusedName : name}
      size={size}
      color={color}
      style={{ marginBottom: 2 }}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[400],
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.neutral[200],
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 24,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
          marginTop: 2,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Sanctuary',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="heart-outline"
              focusedName="heart"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="library-outline"
              focusedName="library"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="journal-outline"
              focusedName="journal"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Atelier',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name="sparkles-outline"
              focusedName="sparkles"
              color={color}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
