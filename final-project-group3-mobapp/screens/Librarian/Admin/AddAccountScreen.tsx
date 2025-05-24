import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Accounts } from '../../../props and context/context';
// Context & Navigation
import { Context } from '../../../props and context/context';
import { useNavigation } from '@react-navigation/native';

// Styles
import { styles } from '../../../styles/Stylesheet';

const inputStyle = {
  borderBottomWidth: 1,
  marginVertical: 8,
  paddingVertical: 4,
  fontSize: 16,
};

export default function AddAccountScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const navigation = useNavigation();
  const {
    users,
    librarians,
    setUsers,
    setLibrarians,
    targetAccount,
  } = useContext(Context);

  const [newRole, setNewRole] = useState<'user' | 'librarian' | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const isEditing = !!targetAccount;
  const thisAccount = users.find((user) => user.id === targetAccount);

  // Generate unique ID based on role
  const generateNewId = (role: 'user' | 'librarian') => {
    const list = role === 'user' ? users : librarians;
    const ids = list.map((b) => parseInt(b.id.slice(2))).filter((id) => !isNaN(id));
    const maxId = ids.length ? Math.max(...ids) : 0;
    return `${role === 'user' ? 'US' : 'LB'}${(maxId + 1).toString().padStart(6, '0')}`;
  };

  // Schema validation
  const CreateAccountSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string()
      .email('Invalid email format')
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Must be a valid domain (e.g., .com)')
      .required('Email is required'),
    password: Yup.string()
      .min(4, 'Too short')
      .required('Password is required'),
  });

  // Submit handler
  const handleAddAccount = (values: Accounts) => {
    const { username, email, password, icon } = values;

    if (!newRole) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    const newID = isEditing && thisAccount
      ? thisAccount.id
      : generateNewId(newRole);

    const accountData = {
      id: newID,
      username,
      email,
      password,
      icon: icon || 'https://i.pravatar.cc/150 ', // fallback avatar
    };

    if (isEditing && thisAccount) {
      const updatedList = newRole === 'user'
        ? users.map(u => u.id === thisAccount.id ? { ...u, ...accountData } : u)
        : librarians.map(l => l.id === thisAccount.id ? { ...l, ...accountData } : l);

      newRole === 'user' ? setUsers(updatedList) : setLibrarians(updatedList);
    } else {
      newRole === 'user'
        ? setUsers([...users, accountData])
        : setLibrarians([...librarians, accountData]);
    }

    Alert.alert(isEditing ? 'Account Updated' : 'Account Created');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingRight: 20, paddingLeft: isLandscape ? 60 : 20 }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Formik
              initialValues={{
                id: thisAccount?.id || generateNewId('user'),
                username: thisAccount?.username || '',
                email: thisAccount?.email || '',
                password: thisAccount?.password || '',
                icon: thisAccount?.icon || '',
              }}
              validationSchema={CreateAccountSchema}
              onSubmit={handleAddAccount}
              enableReinitialize
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, setFieldValue }) => {
                const pickImage = async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 1,
                  });
                  if (!result.canceled) {
                    // Set avatar via Formik
                    setFieldValue('icon', result.assets[0].uri);
                  }
                };

                return (
                  <View style={{ width: '100%' }}>
                    {/* Avatar Preview */}
                    <TouchableOpacity
                      onPress={pickImage}
                      style={{
                        alignSelf: 'center',
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                        overflow: 'hidden',
                        backgroundColor: '#f0f0f0',
                      }}
                    >
                      {values.icon ? (
                        <Image
                          source={{ uri: values.icon }}
                          style={{ width: 100, height: 100, borderRadius: 50 }}
                        />
                      ) : (
                        <Text>Pick Avatar</Text>
                      )}
                    </TouchableOpacity>

                    {/* Username */}
                    <Text style={styles.labelStyle}>Username</Text>
                    <TextInput
                      placeholder="Enter username"
                      placeholderTextColor="#888"
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      value={values.username}
                      style={inputStyle}
                    />
                    {touched.username && errors.username && (
                      <Text style={styles.errorText}>{errors.username}</Text>
                    )}

                    {/* Email */}
                    <Text style={styles.labelStyle}>Email</Text>
                    <TextInput
                      placeholder="Enter email"
                      placeholderTextColor="#888"
                      autoCapitalize="none"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      style={inputStyle}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}

                    {/* Password */}
                    <Text style={styles.labelStyle}>Password</Text>
                    <TextInput
                      placeholder="Enter password"
                      placeholderTextColor="#888"
                      secureTextEntry
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      style={inputStyle}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}

                    {/* Role Picker */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 }}>
                      <TouchableOpacity
                        style={[
                          styles.buttonContainer,
                          newRole === 'user' && { backgroundColor: '#007AFF' },
                        ]}
                        onPress={() => setNewRole('user')}
                      >
                        <Text style={styles.buttonText}>User</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.buttonContainer,
                          newRole === 'librarian' && { backgroundColor: '#007AFF' },
                        ]}
                        onPress={() => setNewRole('librarian')}
                      >
                        <Text style={styles.buttonText}>Librarian</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={()=>handleSubmit()}
                      disabled={!isValid}
                    >
                      <Text style={styles.buttonText}>
                        {isEditing ? 'Update Account' : 'Create Account'}
                      </Text>
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      style={{
                        marginTop: 12,
                        padding: 14,
                        backgroundColor: '#dc3545',
                        borderRadius: 8,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </Formik>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}