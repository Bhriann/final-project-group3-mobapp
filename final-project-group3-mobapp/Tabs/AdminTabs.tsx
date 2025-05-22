import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screens
import BooksScreen from '../screens/Librarian/Admin/BooksScreen';
import AccountsScreen from '../screens/Librarian/Admin/AccountsScreen';
import LogsScreen from '../screens/Librarian/Admin/LogsScreen';
import ReportsScreen from '../screens/Librarian/Admin/ReportsScreen';

const Tabs = createBottomTabNavigator(); // ✅ Typed!

export default function AdminTabs() {
  return (
    <Tabs.Navigator initialRouteName="BooksScreen" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="BooksScreen" component={BooksScreen} />
      <Tabs.Screen name="AccountsScreen" component={AccountsScreen} />
      <Tabs.Screen name="LogsScreen" component={LogsScreen} />
      <Tabs.Screen name="ReportsScreen" component={ReportsScreen} />
    </Tabs.Navigator>
  );
}