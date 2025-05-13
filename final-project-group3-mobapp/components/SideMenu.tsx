import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SideMenu: React.FC = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' as never }] });
  };

  return (
    <View style={styles.menu}>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default SideMenu;

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 150,
    height: '100%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    zIndex: 10,
  },
});
