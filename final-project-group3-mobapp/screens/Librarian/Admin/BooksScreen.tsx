import React, {useState, useContext} from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
//import { FontAwesome } from '@expo/vector-icons';
import { styles } from '../../../styles/Stylesheet';
import { Context } from '../../../props and context/context';
import * as ScreenOrientation from 'expo-screen-orientation';

const BooksScreen: React.FC = () => {
 //add the parameters here coming from context.tsx
     const {} = useContext(Context);
 // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT); //Change Landscape
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}> Librarian</Text>
      </View>
      <View style={styles.body}>
        <Text>Create, Browse, Edit and Delete Books</Text>
        <Text>Search and Filter Books, Browse, Edit and Delete Books</Text>
      </View>
    </SafeAreaView>
  );
};

export default BooksScreen;
