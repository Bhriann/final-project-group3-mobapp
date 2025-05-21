import React, { useState, useEffect } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import 'react-native-get-random-values';

// Navigation and Context
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContextProvider } from './props and context/context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/User/UserScreen';
import BooksScreen from './screens/Librarian/Admin/BooksScreen';
import ProfileScreen from './screens/User/ProfileScreen';
import AccountsScreen from './screens/Librarian/Admin/AccountsScreen';
import LogsScreen from './screens/Librarian/Admin/LogsScreen';
import ReportsScreen from './screens/Librarian/Admin/ReportsScreen';

// Import AddBookScreen (make sure this file exists)
import AddBookScreen from './screens/Librarian/Admin/AddBookScreen';

// Import the new LoadingScreen
import LoadingScreen from './screens/LoadingScreen'; // Adjust path if needed

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Admin Tabs
function AdminTabs() {
  return (
    <Tabs.Navigator initialRouteName="BooksScreen" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="BooksScreen" component={BooksScreen} />
      <Tabs.Screen name="AccountsScreen" component={AccountsScreen} />
      <Tabs.Screen name="LogsScreen" component={LogsScreen} />
      <Tabs.Screen name="ReportsScreen" component={ReportsScreen} />
    </Tabs.Navigator>
  );
}

// Librarian Tabs
function LibrarianTabs() {
  return (
    <Tabs.Navigator initialRouteName="LogsScreen" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="LogsScreen" component={LogsScreen} />
      <Tabs.Screen name="BooksScreen" component={BooksScreen} />
    </Tabs.Navigator>
  );
}

// Librarian Stack including AddBook screen
function LibrarianStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Bottom tabs */}
      <Stack.Screen name="LibrarianTabs" component={LibrarianTabs} />
      {/* AddBook screen */}
      <Stack.Screen name="AddBook" component={AddBookScreen} />
    </Stack.Navigator>
  );
}

// User Tabs
function UserTabs() {
  return (
    <Tabs.Navigator initialRouteName="UserScreen" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="UserScreen" component={UserScreen} />
      <Tabs.Screen name="ProfileScreen" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate any initial loading tasks here (e.g., fetching data, checking authentication)
    // For now, we'll just use a setTimeout to simulate a delay.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Display loading screen for 3 seconds

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Admin" component={AdminTabs} />
            <Stack.Screen name="Librarian" component={LibrarianStack} />
            <Stack.Screen name="User" component={UserTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </SafeAreaView>
  );
}