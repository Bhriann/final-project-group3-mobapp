import React, { useContext, useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, Alert, View } from 'react-native';
import { styles } from '../styles/Stylesheet';
import { Context } from '../props and context/context';
import { NavigationProp } from "@react-navigation/native";

import { Formik } from 'formik';
import * as Yup from 'yup';



export interface Props {
    navigation: NavigationProp<any>;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { users, setUsers, setAccount } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);

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
});

  const handleSignUp = (values: { name: string; email: string; password: string }) => {
  const { name, email, password } = values;

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
  password
};

setUsers([...users, newUser]);   
setAccount(newUser.id);          
navigation.navigate('User');     
};


  return (
    <SafeAreaView style={styles.LogInContainer}>
      <Text style={styles.title}>Bookman Sign Up</Text>

      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={SignUpSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, dirty }) => (
          <>
            <TextInput
              placeholder="Full Name"
              style={styles.input}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {errors.name && touched.name && <Text style={{ color: 'red' }}>{errors.name}</Text>}

            <TextInput
              placeholder="Email"
              style={styles.input}
              autoCapitalize="none"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {errors.email && touched.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}

            <View style={styles.passwordInputContainer}>
            <TextInput
               placeholder="Password"
               style={styles.passwordInput}
               secureTextEntry={!showPassword}
               onChangeText={handleChange('password')}
               onBlur={handleBlur('password')}
               value={values.password}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showButton}>
            <Text style={styles.showButtonText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
            </View>
               {errors.password && touched.password && (
              <Text style={{ color: 'red', alignSelf: 'center' }}>{errors.password}</Text>
            )}

          <View style={styles.passwordInputContainer}>
             <TextInput
                placeholder="Confirm Password"
                style={styles.passwordInput}
                secureTextEntry={!showPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
           />
           </View>
               {errors.confirmPassword && touched.confirmPassword && (
           <Text style={{ color: 'red', alignSelf: 'center' }}>{errors.confirmPassword}</Text> 
            )}
            <TouchableOpacity
               style={[
               styles.buttonContainer,
               !(isValid && dirty) && { backgroundColor: '#ccc' } // gray out if not valid
            ]}
               onPress={() => handleSubmit()}
               disabled={!(isValid && dirty)}
            >
            <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Navigate to Log In screen */}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: '#007BFF', marginTop: 20, textAlign: 'center' }}>
                Already have an account? Log In
              </Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default SignUpScreen;
