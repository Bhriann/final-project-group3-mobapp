import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Context } from '../../../props and context/context';
import { styles } from '../../../styles/Stylesheet';

type RootStackParamList = {
  Login: undefined;
  Books: undefined;
  AddBook: undefined;
  EditBook: { bookId: string };
};

type BooksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Books'>;

const BooksScreen = () => {
  const { books, updateBooks } = useContext(Context);
  const navigation = useNavigation<BooksScreenNavigationProp>();

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this book?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const filteredBooks = books.filter(book => book.id !== id);
          updateBooks(filteredBooks);
          // Also update AsyncStorage here if needed
        },
      },
    ]);
  };

  const handleOptions = (id: string) => {
    Alert.alert('Options', 'Choose an action', [
      {
        text: 'Edit',
        onPress: () => navigation.navigate('EditBook', { bookId: id }),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDelete(id),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.headerTitle}>Librarian Books</Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: 'red',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('AddBook')}
        style={[styles.buttonContainer, { margin: 20, alignSelf: 'center' }]}
      >
        <Text style={styles.buttonText}>Add New Book</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {books.map(book => (
          <View key={book.id} style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{book.title}</Text>
              <Text>Author(s): {book.authors}</Text>
              {book.cover ? <Image source={{ uri: book.cover }} style={{ width: 100, height: 150 }} /> : null}
            </View>
            <TouchableOpacity
              onPress={() => handleOptions(book.id)}
              style={{ padding: 10 }}
              accessibilityLabel="Options"
            >
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>⋮</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BooksScreen;