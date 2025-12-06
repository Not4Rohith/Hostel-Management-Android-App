import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { colors } from '../../src/constants/colors';


export default function AdminLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // We handle headers inside the screens
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
          paddingTop: 5,
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#F0F0F0',
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: 5,
        },
      }}
    >
      {/* Tab 1: The Dashboard (Stats) */}
      {/* Tab 1: Dashboard (Restored) */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="mess"
        options={{
          title: 'Mess Menu',
          tabBarIcon: ({ color, size }) => <Ionicons name="restaurant-outline" size={size} color={color} />,
        }}
      />

      {/* Tab 2: The Rooms Grid (Bed Allocation) */}
      <Tabs.Screen
        name="rooms"
        options={{
          title: 'Rooms',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bed-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Tab 3: The Complaints Inbox (To be built next) */}
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Issues',
          tabBarLabel: 'Issues',
          // Ensure you are importing Ionicons at the top!
          tabBarIcon: ({ color, size }) => <Ionicons name="alert-circle-outline" size={size} color={color} />,
        }}
      />

      

      
    </Tabs>
  );
}

