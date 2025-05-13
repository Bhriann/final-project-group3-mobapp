import React, { useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import SideMenu from '../components/SideMenu';
import { FontAwesome } from '@expo/vector-icons';

const UserScreen: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {showMenu && <SideMenu />}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <FontAwesome name="user-circle" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Dashboard</Text>
      </View>
      <View style={styles.body}>
        <Text>Welcome, User!</Text>
      </View>
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    marginLeft: 15,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

