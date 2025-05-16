import React from 'react';
import { StatusBar, SafeAreaView } from 'react-native';

//Navigation and Context
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ContextProvider } from './props and context/context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';//npm install @react-navigation/bottom-tabs
//import { RootStackParamList } from './props and context/navigatorprops';

//Screens
import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/User/UserScreen';
import BooksScreen from './screens/Librarian/Admin/BooksScreen';
import ProfileScreen from './screens/User/ProfileScreen';
import AccountsScreen from './screens/Librarian/Admin/AccountsScreen';
import LogsScreen from './screens/Librarian/Admin/LogsScreen';
import ReportsScreen from './screens/Librarian/Admin/ReportsScreen';


//For Log-In Screen, No bottom menu
const Tabs = createBottomTabNavigator();
//For User or Librarian Screens
const Stack = createNativeStackNavigator();

export default function App() {

  //Screens Admins could use
  function Admin() {
    return (
      <Tabs.Navigator initialRouteName="BooksScreen" screenOptions={{ headerShown: false }} >
        <Tabs.Screen name="BooksScreen" component={BooksScreen} />
        <Tabs.Screen name="AccountsScreen" component={AccountsScreen} />
        <Tabs.Screen name="LogsScreen" component={LogsScreen} />
        <Tabs.Screen name="ReportsScreen" component={ReportsScreen} />
      </Tabs.Navigator>
    )
  }

  //Screens Librarians could use
  function Librarian() {
    return (
      <Tabs.Navigator initialRouteName="LogsScreen" screenOptions={{ headerShown: false }} >
        <Tabs.Screen name="LogsScreen" component={LogsScreen} />
        <Tabs.Screen name="BooksScreen" component={BooksScreen} />
      </Tabs.Navigator>
    )
  }

  //Screens the User could use
  function User() {
    return (
      <Tabs.Navigator initialRouteName="UserScreen" screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="UserScreen" component={UserScreen} />
        <Tabs.Screen name="ProfileScreen" component={ProfileScreen} />
      </Tabs.Navigator>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
      <ContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Admin" component={Admin} />
            <Stack.Screen name="Librarian" component={Librarian} />
            <Stack.Screen name="User" component={User} />
          </Stack.Navigator>
        </NavigationContainer>
      </ContextProvider>
    </SafeAreaView>
  );
}
