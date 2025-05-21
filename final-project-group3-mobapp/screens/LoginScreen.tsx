import React, { useState, useContext } from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
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

  const { admin, users, librarians } = useContext(Context);

  const handleLogin = () => {
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={60}
    >
      <ScrollView
        contentContainerStyle={styles.LogInContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../images/LibriLogo.png')}
          style={localStyles.logo}
        />
        <Text style={styles.title}>Login</Text>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Only for the logo
const localStyles = StyleSheet.create({
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 0.25,
  },
});

export default LoginScreen;