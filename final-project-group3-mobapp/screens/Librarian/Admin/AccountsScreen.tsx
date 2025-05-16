import React, {useState, useContext} from 'react';
import { SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
//import { FontAwesome } from '@expo/vector-icons';
import { styles } from '../../../styles/Stylesheet';
import { Context } from '../../../props and context/context';

const AccountsScreen: React.FC = () => {
 //add the parameters here coming from context.tsx
     const {admin, users, librarians} = useContext(Context);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}> LogScreen</Text>
      </View>
      <View style={styles.body}>
        <Text>Create Delete and Edit Accounts</Text>
      </View>
    </SafeAreaView>
  );
};

export default AccountsScreen;
