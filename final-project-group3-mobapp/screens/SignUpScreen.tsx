import React, { useContext, useState } from 'react';
import { SafeAreaView, Text, Platform, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, View, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

//FORM Imports
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Context } from '../props and context/context';
import { styles } from '../styles/Stylesheet';

//Navigation
import { NavigationProp } from '../props and context/navprops';
import { useNavigation } from '@react-navigation/native';

export default function SignUp() {
  const navigation = useNavigation<NavigationProp>();
  const { users, setUsers, } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);
  const [icon, setIcon] = useState("");

  const SignUpSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .matches(
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        'Email must be a valid domain (e.g., .com)'
      )
      .required('Email is required'),
    password: Yup.string()
      .min(4, 'Too short')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Please confirm your password'),
    icon:Yup.string()
  });

  const handleSignUp = (values: { name: string; email: string; password: string, icon: string }) => {
    const { name, email, password, icon } = values;

    // Check if email already exists
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      Alert.alert('Error', 'Email already exists.');
      return;
    }

    const newUser = {
      id: `US${(users.length + 1).toString().padStart(6, '0')}`,
      username: name,
      email,
      password,
      icon,
    };

    setUsers([...users, newUser]);
    Alert.alert('Account created succesfully!', 'Redirecting back to Log In');
    navigation.goBack();
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFEFCA" }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={{flexDirection:'column', alignItems:"center", justifyContent:"center"}}>
            <Text style={[styles.title, {margin:10}]}>Sign Up</Text>

            <Image source={{ uri: icon || "https://avatar.iran.liara.run/public" }} style={styles.avatar} />
          
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '', icon: '' }}
            validationSchema={SignUpSchema}
            onSubmit={handleSignUp}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty, submitCount, setFieldValue }) => {
              const pickImage = async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 1,
                });
                if (!result.canceled) {
                  setIcon(result.assets[0].uri);
                  setFieldValue('icon', result.assets[0].uri);
                }
              };

              return (
                <View>
                  {/* Pick Cover Button */}
                  <TouchableOpacity
                    onPress={() => pickImage()}
                    style={{
                      backgroundColor: '#007BFF',
                      paddingVertical: 12,
                      borderRadius: 8,
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Pick Cover Image</Text>
                  </TouchableOpacity>

                  {/* Your form fields */}
                  <View style={styles.input}>
                    <TextInput
                      placeholder="Username"
                      placeholderTextColor="#888"
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      value={values.name}
                      style={styles.inputText}
                    />
                  </View>
                  {errors.name && touched.name && <Text style={styles.errorText}>{errors.name}</Text>}

                  {/* Email Input */}
                  <View style={styles.input}>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#888"
                      autoCapitalize="none"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      style={styles.inputText}
                    />
                  </View>
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  {/* Password Input */}
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

                  {/* Confirm Password */}
                  <View style={styles.input}>
                    <TextInput
                      placeholder="Confirm Password"
                      placeholderTextColor="#888"
                      secureTextEntry={!showPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      value={values.confirmPassword}
                      style={styles.inputText}
                    />
                  </View>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}

                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[styles.buttonContainer]}
                    onPress={() => handleSubmit()}
                    disabled={!isValid}
                  >
                    <Text style={styles.buttonText}>Sign Up</Text>
                  </TouchableOpacity>

                  {dirty && submitCount > 0 && (
                    <Text style={styles.errorText}>Please resolve the errors first!</Text>
                  )}

                  {/* Navigate to Log In screen */}
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.signupText}>
                      Already have an account? Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView >
  );
};

