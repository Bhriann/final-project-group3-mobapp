import React, { useContext, useState } from 'react';
import { Context } from '../../props and context/context';
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { styles } from '../../styles/Stylesheet';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  Login: undefined;
  User: undefined;
};

type UserScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'User'>;

const UserScreen = () => {
  const { 
    books, 
    borrowedBooks, 
    favoriteBooks, 
    toggleBorrow, 
    toggleFavorite,
    currentAccount 
  } = useContext(Context);
  
  const navigation = useNavigation<UserScreenNavigationProp>();
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const applySort = (option: string) => {
    setSortOption(option);
    setModalVisible(false);
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
    if (sortOption === 'title-desc') return b.title.localeCompare(a.title);
    if (sortOption === 'author-asc') return a.authors.localeCompare(b.authors);
    if (sortOption === 'author-desc') return b.authors.localeCompare(a.authors);
    return 0;
  });

  const filteredBooks = sortedBooks.filter(book => {
    const searchLower = searchText.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.authors.toLowerCase().includes(searchLower)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.headerTitle}>User Dashboard</Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ backgroundColor: 'red', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar with Filter */}
      <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <TextInput
          placeholder="Search books by title or author"
          value={searchText}
          onChangeText={setSearchText}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 10, padding: 8 }}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Book List */}
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {filteredBooks.map(book => {
          const isBorrowed = borrowedBooks.includes(book.id);
          const isFavorited = favoriteBooks.includes(book.id);
          
          return (
            <View
              key={book.id}
              style={{
                backgroundColor: '#f9f9f9',
                marginBottom: 15,
                padding: 15,
                borderRadius: 10,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>{book.title}</Text>
              <Text style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>By: {book.authors}</Text>
              {book.cover ? (
                <Image
                  source={{ uri: book.cover }}
                  style={{ width: '100%', height: 200, resizeMode: 'contain', borderRadius: 8 }}
                />
              ) : (
                <Text style={{ color: '#aaa' }}>[ No Cover Image ]</Text>
              )}
              
              {/* Borrow & Favorite Buttons */}
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => toggleBorrow(book.id)}
                  style={{
                    backgroundColor: isBorrowed ? '#d9534f' : '#4CAF50',
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {isBorrowed ? 'Return' : 'Borrow'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleFavorite(book.id)}
                  style={{
                    backgroundColor: isFavorited ? '#777' : '#2196F3',
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {isFavorited ? 'Unfavorite' : 'Favorite'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
        {filteredBooks.length === 0 && (
          <View style={{ padding: 20 }}>
            <Text style={{ textAlign: 'center', color: '#555' }}>No books found.</Text>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              width: '80%',
              borderRadius: 10,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Sort books by:</Text>
            <Pressable onPress={() => applySort('title-asc')}>
              <Text style={{ paddingVertical: 8 }}>Title (A-Z)</Text>
            </Pressable>
            <Pressable onPress={() => applySort('title-desc')}>
              <Text style={{ paddingVertical: 8 }}>Title (Z-A)</Text>
            </Pressable>
            <Pressable onPress={() => applySort('author-asc')}>
              <Text style={{ paddingVertical: 8 }}>Author (A-Z)</Text>
            </Pressable>
            <Pressable onPress={() => applySort('author-desc')}>
              <Text style={{ paddingVertical: 8 }}>Author (Z-A)</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 20, alignSelf: 'center' }}>
              <Text style={{ color: 'red' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserScreen;