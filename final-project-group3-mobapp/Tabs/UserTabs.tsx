import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import Screens
import UserScreen from '../screens/User/UserScreen';
import ProfileScreen from '../screens/User/ProfileScreen';


const Tabs = createBottomTabNavigator(); 

export default function UserTabs() {
  return (
    <Tabs.Navigator initialRouteName="UserScreen" screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="UserScreen" component={UserScreen} />
      <Tabs.Screen name="ProfileScreen" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}