import React, { useContext, useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, Alert, View } from 'react-native';
import { styles } from '../../styles/Stylesheet';
import { Context } from '../../props and context/context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../props and context/navigatorprops';
import { Formik } from 'formik';
import * as Yup from 'yup';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const { users, setUsers, setAccount } = useContext(Context);
  const [showPassword, setShowPassword] = useState(false);

  const SignUpSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(4, 'Too short').required('Password is required'),
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
    id: `US${(users.length + 1).toString().padStart(6, '0')}`, // ID
    username: name,  // 
    email,
    password
  };

  setUsers([...users, newUser]);
  navigation.replace('Login');
};


  return (
    <SafeAreaView style={styles.LogInContainer}>
      <Text style={styles.title}>User Sign Up</Text>

      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        validationSchema={SignUpSchema}
        onSubmit={handleSignUp}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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

            <View style={{ width: '90%', maxWidth: 400, alignSelf: 'center' }}>
              <TextInput
                placeholder="Password"
                style={styles.input}
                secureTextEntry={!showPassword}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={{ color: '#007BFF', alignSelf: 'flex-end', marginBottom: 10 }}>
                  {showPassword ? 'Hide' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && touched.password && (
              <Text style={{ color: 'red' }}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.buttonContainer} onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default SignUpScreen;
