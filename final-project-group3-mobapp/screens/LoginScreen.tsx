import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, TextInput, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../props and context/navigatorprops';
import { styles } from '../styles/Stylesheet';
import { Context } from '../props and context/context';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {admin, users, librarians, setAccount} = useContext(Context);

  const handleLogin = () => {
    //this needs to get updated by checking if the user is an admin, user or librarian via our data base.
    if (email === 'admin@example.com' && password === 'admin123') {
      navigation.replace('Admin');
    } else if (email === 'librarian@example.com' && password === 'lib123') {
        navigation.replace('Librarian');
    } else if (email === 'user@example.com' && password === 'user123') {
      navigation.replace('User');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <SafeAreaView style={styles.LogInContainer}>
      <Text style={styles.title}>Library Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;

