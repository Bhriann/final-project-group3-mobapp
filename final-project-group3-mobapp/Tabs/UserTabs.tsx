import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

// Screens
import UserScreen from '../screens/User/UserScreen';
import ProfileScreen from '../screens/User/ProfileScreen';

// Icons
import { Ionicons } from '@expo/vector-icons';

const Tabs = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tabs.Navigator
      initialRouteName="UserScreen"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFD327',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="UserScreen"
        component={UserScreen}
        options={{
          tabBarLabel: 'Library',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'book' : 'book-outline'} size={24} color={focused ? '#FFD327' : 'gray'} />
          ),
        }}
      />

      <Tabs.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={focused ? '#FFD327' : 'gray'} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
}