import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView } from 'react-native';
//import { FontAwesome } from '@expo/vector-icons';
import { styles } from '../../../styles/Stylesheet';
import { Context } from '../../../props and context/context';
import { RenderLogs } from '../../../components/RenderLogs';
import * as ScreenOrientation from 'expo-screen-orientation';

const LogsScreen: React.FC = () => {
  const { } = useContext(Context);
  const changeOrientation = async () => {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT); //Change Landscape
    //await ScreenOrientation.unlockAsync();
  }

  changeOrientation();
  return (
     
    <SafeAreaView style={styles.container}>
      <RenderLogs></RenderLogs>
    </SafeAreaView>
  );
};

export default LogsScreen;
