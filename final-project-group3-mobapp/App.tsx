import React from 'react';
import { StatusBar, SafeAreaView, useWindowDimensions, } from 'react-native';
import { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

// Navigation and Context
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContextProvider } from './props and context/context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen'; //added
import UserScreen from './screens/User/UserScreen';
import BooksScreen from './screens/Librarian/Admin/BooksScreen';
import ProfileScreen from './screens/User/ProfileScreen';
import AccountsScreen from './screens/Librarian/Admin/AccountsScreen';
import LogsScreen from './screens/Librarian/Admin/LogsScreen';
import ReportsScreen from './screens/Librarian/Admin/ReportsScreen';
import AddBookScreen from './screens/Librarian/Admin/AddBookScreen';

import LoadingScreen from './screens/LoadingScreen'; // Adjust path if needed

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigators
export const AdminTabs = () => (
  <Tabs.Navigator initialRouteName="BooksScreen" screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="BooksScreen" component={BooksScreen} />
    <Tabs.Screen name="AccountsScreen" component={AccountsScreen} />
    <Tabs.Screen name="LogsScreen" component={LogsScreen} />
    <Tabs.Screen name="ReportsScreen" component={ReportsScreen} />
  </Tabs.Navigator>
);

export const AdminStack = () => (
  <Stack.Navigator initialRouteName="AdminTabs" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminTabs" component={AdminTabs} />
    <Stack.Screen name="AddBook" component={AddBookScreen} />
  </Stack.Navigator>
);

export const LibrarianTabs = () => (
  <Tabs.Navigator initialRouteName="LogsScreen" screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="LogsScreen" component={LogsScreen} />
    <Tabs.Screen name="BooksScreen" component={BooksScreen} />
  </Tabs.Navigator>
);

export const LibrarianStack = () => (
  <Stack.Navigator initialRouteName="LibrarianTabs" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="LibrarianTabs" component={LibrarianTabs} />
    <Stack.Screen name="AddBook" component={AddBookScreen} />
  </Stack.Navigator>
);

export const UserTabs = () => (
  <Tabs.Navigator initialRouteName="UserScreen" screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="UserScreen" component={UserScreen} />
    <Tabs.Screen name="ProfileScreen" component={ProfileScreen} />
  </Tabs.Navigator>
);

// --- Main App Component ---
export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [isLoading, setIsLoading] = useState(true);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);

  const isLandscapeLeft = orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT;
  const isLandscapeRight = orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  useEffect(() => {
    const init = async () => {
      const initialOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(initialOrientation);

      const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });

      // Simulate loading
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      return () => {
        clearTimeout(timer);
        subscription.remove();
      };
    };

    init();
  }, []);


  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{
      flex: 1, marginTop: StatusBar.currentHeight,
      paddingLeft: isLandscapeLeft ? 50 : 0,
      paddingRight: isLandscapeRight ? 50 : 0,
    }}>
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Admin" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Admin" component={AdminStack} />
            <Stack.Screen name="Librarian" component={LibrarianStack} />
            <Stack.Screen name="User" component={UserTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </SafeAreaView>
  );
}