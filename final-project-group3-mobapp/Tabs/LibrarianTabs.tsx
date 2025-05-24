import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screens
import BooksScreen from '../screens/Librarian/Admin/BooksScreen';
import LogsScreen from '../screens/Librarian/Admin/LogsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tabs = createBottomTabNavigator(
  
); // ✅ Typed!

export default function LibrarianTabs() {
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
    </Tabs.Navigator>
  );
}