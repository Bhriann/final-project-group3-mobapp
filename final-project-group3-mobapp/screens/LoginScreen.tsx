import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Context } from '../props and context/context';
import { styles } from '../styles/Stylesheet';

type Props = {
  navigation: any;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { admin, users, librarians, setAccount } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(4, 'Too short').required('Password is required'),
  });

  const handleLogin = (values: { email: string; password: string }) => {
    const { email, password } = values;
    const foundAdmin = admin.find((acc) => acc.email === email && acc.password === password);
    const foundLibrarian = librarians.find(
      (acc) => acc.email === email && acc.password === password
    );
    const foundUser = users.find((acc) => acc.email === email && acc.password === password);

    if (foundAdmin) {
      setAccount(foundAdmin.id);
      navigation.replace('Admin');
    } else if (foundLibrarian) {
      setAccount(foundLibrarian.id);
      navigation.replace('Librarian');
    } else if (foundUser) {
      setAccount(foundUser.id);
      navigation.replace('User');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Use 'height' for Android
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require('../images/LibriLogo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>Bookman Login</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
              <>
                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* Password Field */}
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    placeholder="Password"
                    style={styles.passwordInput}
                    secureTextEntry={!showPassword}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.showButton}
                  >
                    <Text style={styles.showButtonText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.buttonContainer,
                    { backgroundColor: isValid ? '#007BFF' : '#a0a0a0' },
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={!isValid}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;