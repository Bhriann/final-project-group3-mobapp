import React, { useContext, useState } from 'react';
import { SafeAreaView, Text, View, Alert, TouchableOpacity, TextInput, Image, useWindowDimensions, KeyboardAvoidingView, Platform, ScrollView, } from 'react-native';

import { Formik } from 'formik';
import * as Yup from 'yup';

// Context & Styles
import { Context } from '../props and context/context';
import { styles } from '../styles/Stylesheet';

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../props and context/navprops';

export default function LoginScreen() {

  const navigation = useNavigation<NavigationProp>();

  const { admin, users, librarians, setCurrentAccount } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = (values: { email: string; password: string }) => {
    const { email, password } = values;

    const foundAdmin = admin.find((acc) => acc.email === email && acc.password === password);
    const foundLibrarian = librarians.find((acc) => acc.email === email && acc.password === password);
    const foundUser = users.find((acc) => acc.email === email && acc.password === password);


    if (foundAdmin) {
      setCurrentAccount(foundAdmin.id);
      navigation.replace('Admin');
    } else if (foundLibrarian) {
      setCurrentAccount(foundLibrarian.id);
      navigation.replace('Librarian');
    } else if (foundUser) {
      setCurrentAccount(foundUser.id);
      navigation.replace('User');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  
  return (
    <SafeAreaView style={[styles.container, { paddingRight: 20, paddingLeft: isLandscape ? 60 : 20, backgroundColor: "#FFEFCA" }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          bounces={true}
        >
          <Image
            source={require('../images/LibriLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Log In</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, dirty, values, errors, touched, isValid, submitCount }) => (
              <>
                <View style={styles.input}>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#888"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    style={styles.inputText}
                  />
                </View>

                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* Password */}
                <View style={styles.input}>
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry={!showPassword}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                   style={styles.inputText}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.showButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>

                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.buttonContainer, {}
                  ]}
                  onPress={() => isValid && handleSubmit()}
                >
                  <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>

                 {dirty && submitCount>0 && (
                                  <Text style={styles.errorText}>Please resolve the errors first!</Text>
                                )}

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

