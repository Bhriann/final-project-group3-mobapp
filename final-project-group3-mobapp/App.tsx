import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import UserScreen from './screens/UserScreen';
import LibrarianScreen from './screens/LibrarianScreen';
import { RootStackParamList } from './props and context/navigatorprops';
import { ContextProvider } from './props and context/context';
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ContextProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Admin" component={LibrarianScreen} />
        <Stack.Screen name="User" component={UserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </ContextProvider>
  );
}
