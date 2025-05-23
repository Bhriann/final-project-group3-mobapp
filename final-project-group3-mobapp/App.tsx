import React, { useState, useEffect } from 'react';
import { View, StatusBar, SafeAreaView, useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Context
import { ContextProvider } from './props and context/context';

// Screens
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import AddBookScreen from './screens/Librarian/Admin/AddBookScreen';
import BookPage  from './screens/User/BookPage';
import LoadingScreen from './screens/LoadingScreen';
import {RootStackParamList} from './props and context/navprops';
import AdminTabs from './Tabs/AdminTabs';
import LibrarianTabs from './Tabs/LibrarianTabs';
import UserTabs from './Tabs/UserTabs';

const Stack = createNativeStackNavigator();

// --- Main App Component ---
export default function App() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            {/* Auth */}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />

            {/* Tab Stacks */}
            <Stack.Screen name="Admin" component={AdminTabs} />
            <Stack.Screen name="Librarian" component={LibrarianTabs} />
            <Stack.Screen name="User" component={UserTabs} />

            {/* Standalone Screens */}
            <Stack.Screen name="AddBook" component={AddBookScreen} />
            <Stack.Screen name="BookPage" component={BookPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </SafeAreaView>
  );
}