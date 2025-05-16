import React, { useState, useContext} from 'react';
import { Context } from '../../props and context/context';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
//import { FontAwesome } from '@expo/vector-icons';
import { RenderBooks } from '../../components/RenderBooks';
import { styles } from '../../styles/Stylesheet';

const UserScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Dashboard</Text>
      </View>
      <View style={styles.body}>
      <Text style={[]}>Add Search and categories</Text>
        <RenderBooks></RenderBooks> {/* rendering book list here*/}
      </View>
    </SafeAreaView>
  );
};

export default UserScreen;


