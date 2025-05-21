import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { styles } from '../../../styles/Stylesheet';
import { Context } from '../../../props and context/context';

import * as Yup from 'yup';
import { Formik } from 'formik';

const AccountsScreen: React.FC = () => {
  const { admin, users, librarians, setUsers, setLibrarians } = useContext(Context);

  const [modalVisible, setModalVisible] = useState(false);
  const [newRole, setNewRole] = useState<'user' | 'librarian' | null>(null);

  const handleDelete = (role: string, index: number) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (role === 'user') {
            const updatedUsers = [...users];
            updatedUsers.splice(index, 1);
            setUsers(updatedUsers);
          } else {
            const updatedLibs = [...librarians];
            updatedLibs.splice(index, 1);
            setLibrarians(updatedLibs);
          }
        },
      },
    ]);
  };

  const CreateAccountSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string()
      .email('Invalid email format')
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Must be a valid email with domain')
      .required('Email is required'),
    password: Yup.string().min(4, 'Password too short').required('Password is required'),
  });

  const handleAddAccount = (values: { username: string; email: string; password: string }) => {
    const { username, email, password } = values;

    if (!newRole) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    const newId =
      newRole === 'user'
        ? `US${(users.length + 1).toString().padStart(6, '0')}`
        : `LB${(librarians.length + 1).toString().padStart(6, '0')}`;

    const newAccount = {
      id: newId,
      username,
      email,
      password
    };

    if (newRole === 'user') {
      setUsers([...users, newAccount]);
    } else {
      setLibrarians([...librarians, newAccount]);
    }

    setModalVisible(false);
    setNewRole(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Accounts</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionHeader}>Librarians</Text>
        <FlatList
          data={librarians}
          keyExtractor={(item, index) => `${item.username}-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
            <View style={{ flex: 1 }}>
            <Text numberOfLines={2} style={styles.listItemText}>
            {item.username} ({item.email})
        </Text>
        </View>
            <TouchableOpacity onPress={() => handleDelete('librarian', index)}>
            <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
            </View>
          )}
        />

        <Text style={styles.sectionHeader}>Users</Text>
        <FlatList
          data={users}
          keyExtractor={(item, index) => `${item.username}-${index}`}
          renderItem={({ item, index }) => (
            <View style={styles.listItem}>
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={styles.listItemText}>
                  {item.username} ({item.email})
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete('user', index)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Create New Account</Text>
        </TouchableOpacity>

        {/* Modal Popup */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '90%' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                Create New Account
              </Text>

        {/* Role Selector */}
<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
  <TouchableOpacity
    onPress={() => setNewRole('user')}
    style={[
      styles.roleButton,
      { flex: 1, alignItems: 'center', paddingVertical: 10 },
      newRole === 'user' && styles.roleButtonSelected
    ]}
  >
    <Text style={{ fontWeight: newRole === 'user' ? 'bold' : 'normal' }}>User</Text>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => setNewRole('librarian')}
    style={[
      styles.roleButton,
      { flex: 1, alignItems: 'center', paddingVertical: 10 },
      newRole === 'librarian' && styles.roleButtonSelected
    ]}
  >
    <Text style={{ fontWeight: newRole === 'librarian' ? 'bold' : 'normal' }}>Librarian</Text>
  </TouchableOpacity>
</View>


  {/* Formik Form */}
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      validationSchema={CreateAccountSchema}
      onSubmit={handleAddAccount}
    >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
    <>
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={handleChange('username')}
        onBlur={handleBlur('username')}
        value={values.username}
    />
      {errors.username && touched.username && (
        <Text style={{ color: 'red' }}>{errors.username}</Text>
      )}

    <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        onChangeText={handleChange('email')}
        onBlur={handleBlur('email')}
        value={values.email}
     />
        {errors.email && touched.email && (
    <Text style={{ color: 'red' }}>{errors.email}</Text>
        )}

    <TextInput
       placeholder="Password"
       style={styles.input}
       secureTextEntry
       onChangeText={handleChange('password')}
       onBlur={handleBlur('password')}
       value={values.password}
    />
      {errors.password && touched.password && (
      <Text style={{ color: 'red' }}>{errors.password}</Text>
      )}

  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
  <TouchableOpacity
    style={[styles.buttonContainer, { backgroundColor: 'red', flex: 1, marginRight: 5 }]}
    onPress={() => setModalVisible(false)}
  >
    <Text style={styles.buttonText}>Cancel</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.buttonContainer, { flex: 1, marginLeft: 5 }]}
    onPress={() => handleSubmit()}
  >
    <Text style={styles.buttonText}>Add</Text>
  </TouchableOpacity>
</View>
  </>
  )}
      </Formik>
    </View>
    </View>
    </Modal>
    </View>
    </SafeAreaView>
  );
};

export default AccountsScreen;
