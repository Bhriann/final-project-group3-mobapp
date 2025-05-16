import React, {useState, useContext} from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
//import { FontAwesome } from '@expo/vector-icons';
import { styles } from '../../../styles/Stylesheet';
import { Context } from '../../../props and context/context';

const LogsScreen: React.FC = () => {
 //add the parameters here coming from context.tsx
     const {} = useContext(Context);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}> LogScreen</Text>
      </View>
      <View style={styles.body}>
        <Text>Show all pending borrowing request and approve them</Text>
        <Text>Add to the borrowing logs</Text>
        <Text>Change borrowing status to returned</Text>

        <Text> If user is an admin, Edit and Delete Logs functionality</Text>
      </View>
    </SafeAreaView>
  );
};

export default LogsScreen;
