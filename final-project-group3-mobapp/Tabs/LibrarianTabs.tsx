import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screens
import BooksScreen from '../screens/Librarian/Admin/BooksScreen';
import LogsScreen from '../screens/Librarian/Admin/LogsScreen';


const Tabs = createBottomTabNavigator(); // ✅ Typed!

export default function LibrarianTabs() {
  return (
    <Tabs.Navigator initialRouteName="BooksScreen" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="BooksScreen" component={BooksScreen} />
      <Tabs.Screen name="LogsScreen" component={LogsScreen} />
    </Tabs.Navigator>
  );
}