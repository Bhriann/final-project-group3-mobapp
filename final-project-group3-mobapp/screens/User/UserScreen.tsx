import React, { useContext, useState } from 'react';
import { Context } from '../../props and context/context';
import { SafeAreaView, Text, View, FlatList, Image, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable, Alert } from 'react-native';
import { styles } from '../../styles/Stylesheet';
import { Ionicons } from '@expo/vector-icons';
import { BorrowingLog } from '../../props and context/context';
import dayjs from 'dayjs';
import { Book } from '../../props and context/context';
import { LinearGradient } from 'expo-linear-gradient';
//Navigation
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../props and context/navprops';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
export default function UserScreen() {

  const navigation = useNavigation<NavigationProp>();
  const { books, toggleFavorite, setSelectedBookId, currentAccount, favoriteBooksList, users } = useContext(Context);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const applySort = (option: string) => {
    setSortOption(option);
    setModalVisible(false);
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
    if (sortOption === 'title-desc') return b.title.localeCompare(a.title);
    if (sortOption === 'author-asc') return a.author.localeCompare(b.author);
    if (sortOption === 'author-desc') return b.author.localeCompare(a.author);
    return 0;
  });

  const filteredBooks = sortedBooks.filter(book => {
    const searchLower = searchText.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower)
    );
  });

  const handleBookPress = (id: string) => {
    setSelectedBookId(id);
    navigation.navigate('BookPage');
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFEFCA" }]}>

      {/* Header */}
      <View style={[styles.header, { flexDirection: 'column', }]}>
        <Text style={styles.title}>Welcome, {users.find((user) => user.id === currentAccount)?.username}</Text>
        <Text style={styles.mediumfont}>What shall we be reading today?</Text>
      </View>

      {/* Search Bar with Filter */}
      <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <TextInput
          placeholder="Search books by title or author"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchBar}
        />
        <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 10, padding: 8 }}>
          <Ionicons name="filter" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.bookFlatlistContainer}
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', padding: 20 }}>No books found</Text>
        }


        renderItem={({ item }) => {
          const isFavorited = favoriteBooksList.some((b) => b.id === item.id);
          return (
            <TouchableOpacity style={styles.bookCard} onPress={() => handleBookPress(item.id)}>

              {/* Book Cover */}
              <Image source={{ uri: item.cover }} style={styles.bookCover} />
              
              {/* Dark Gradient Overlay */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFillObject}
              />
              {/* Favorite Star - Top Right */}
              <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)}>
                <Text>{isFavorited ? '⭐' : '✩'}</Text>
              </TouchableOpacity>

              {/* Title & Author Overlay - On top of image */}
              <View style={styles.overlayTextContainer}>
                <Text numberOfLines={1} style={[styles.bookTitle ]}>{item.title}</Text>
                <Text numberOfLines={1} style={[styles.bookAuthor]}>{item.author}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

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