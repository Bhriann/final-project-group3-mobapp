import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screens
import BooksScreen from '../screens/Librarian/Admin/BooksScreen';
import AccountsScreen from '../screens/Librarian/Admin/AccountsScreen';
import LogsScreen from '../screens/Librarian/Admin/LogsScreen';
import ReportsScreen from '../screens/Librarian/Admin/ReportsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tabs = createBottomTabNavigator(); // ✅ Typed!

export default function AdminTabs() {
  return (
    <Tabs.Navigator 
     initialRouteName="BooksScreen"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFD327',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tabs.Screen name="BooksScreen" component={BooksScreen}
       options={{
          tabBarLabel: 'Library Archive',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'albums' : 'albums-outline'} size={24} color={focused ? '#FFD327' : 'gray'} />
          ),
        }} />
      <Tabs.Screen name="LogsScreen" component={LogsScreen} 
      options={{
          tabBarLabel: 'Acitivity Logs',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'documents' : 'documents-outline'} size={24} color={focused ? '#FFD327' : 'gray'} />
          ),
        }} />
        <Tabs.Screen name="AccountsScreen" component={AccountsScreen}
         options={{
          tabBarLabel: 'Accounts',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} size={24} color={focused ? '#FFD327' : 'gray'} />
          ),
        }} />
      <Tabs.Screen name="ReportsScreen" component={ReportsScreen} 
       options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} size={24} color={focused ? '#FFD327' : 'gray'} />
          ),
        }}/>
    </Tabs.Navigator>
  );
}