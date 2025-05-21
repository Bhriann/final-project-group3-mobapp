import React from 'react';
import { StatusBar, SafeAreaView, useWindowDimensions } from 'react-native';

//Navigation and Context
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContextProvider } from './props and context/context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; //npm install @react-navigation/bottom-tabs
//import { RootStackParamList } from './props and context/navigatorprops';

//Screens
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen'; //added
import UserScreen from './screens/User/UserScreen';
import BooksScreen from './screens/Librarian/Admin/BooksScreen';
import ProfileScreen from './screens/User/ProfileScreen';
import AccountsScreen from './screens/Librarian/Admin/AccountsScreen';
import LogsScreen from './screens/Librarian/Admin/LogsScreen';
import ReportsScreen from './screens/Librarian/Admin/ReportsScreen';

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

export const LibrarianTabs = () => (
  <Tabs.Navigator initialRouteName="LogsScreen" screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="LogsScreen" component={LogsScreen} />
    <Tabs.Screen name="BooksScreen" component={BooksScreen} />
  </Tabs.Navigator>
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
  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight, paddingLeft: isLandscape ? 50 : 0 }}>
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Admin" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
             <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Admin" component={AdminTabs} />
            <Stack.Screen name="Librarian" component={LibrarianTabs} />
            <Stack.Screen name="User" component={UserTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </SafeAreaView>
  );
}
