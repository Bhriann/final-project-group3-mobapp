import React, { useState, useContext, useEffect, useMemo } from 'react';
import { SafeAreaView, Text, View, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/Stylesheet';
import { Context } from '../../props and context/context';
import { Book } from '../../props and context/context';

//Navigation
import { useNavigation } from '@react-navigation/native';
import BookPage from './BookPage';
import { NavigationProp } from '../../props and context/navprops';


export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { books, currentAccount, setSelectedBookId, setCurrentAccount, favoriteBooksList, borrowHistory, users } = useContext(Context);

  const [borrowHistoryObjects, setBorrowHistoryObjects] = useState<Book[]>([]);
  const [bookRequestObjects, setBookRequestObjects] = useState<Book[]>([]);
 
 useMemo(() => {
    const borrowBookId = borrowHistory.filter((log) => log.dateLent).map((book) => book.bookid);
    const borrowedBooks = borrowBookId.flatMap(id => books.find(book => book.id === id) ?? []);  //filters out undefined, returns Book[] type objects
    setBorrowHistoryObjects(borrowedBooks);

    const requestBookId = borrowHistory.filter((log) => !log.dateLent).map((book) => book.bookid);
    const requestedBooks = requestBookId.flatMap(id => books.find(book => book.id === id) ?? []);  //filters out undefined, returns Book[] type objects
    setBookRequestObjects(requestedBooks);
  }, [borrowHistory]);

  const handleLogout = () => {
    navigation.navigate('Login');
    setCurrentAccount("");
  };

  const handleBookOnPress = (item: string) => { setSelectedBookId(item); navigation.navigate('BookPage') }

  const renderBookItem = ({ item }: { item: Book }) => {
    return (
      <TouchableOpacity
        onPress={() => handleBookOnPress(item.id)}
        style={{ marginRight: 10 }}
      >
        <Image
          source={{ uri: item.cover || 'https://via.placeholder.com/150 ' }}
          style={{
            width: 120,
            height: 180,
            resizeMode: 'cover',
            borderRadius: 8,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFEFCA" }]}>
      {/* Logout Button - Top Right */}
      <View style={{
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
      }}>
        <TouchableOpacity onPress={handleLogout} style={{
          backgroundColor: '#AC0306',
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 5,
        }}>
          <Text style={{ color: 'white', fontFamily: 'Grotesk_Medium'}}>Logout</Text>
        </TouchableOpacity>
      </View>

       {/* User Header */}
  <View style={styles.profileHeader}>
    <Image source={{ uri: 'https://i.pravatar.cc/150 ' }} style={styles.avatar} />
    <Text style={styles.userName}>{users.find((user) => user.id === currentAccount)?.username}</Text>
    <Text style={styles.userEmail}>{users.find((user) => user.id === currentAccount)?.email}</Text>
  </View>

    <ScrollView
    contentContainerStyle={styles.scrollProfile}
    style={{flex:1}}
    showsVerticalScrollIndicator={false}
  >
     {/* Requested Books */}
    <View style={styles.profileSection}>
      <Text style={styles.profileTitle}>Requested Books</Text>
      <FlatList
      style={{marginLeft:10}}
        data={bookRequestObjects.reverse()}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyProfile}>No books yet... Go borrow!</Text>}
      />
    </View>

    {/* Borrow History */}
    <View style={styles.profileSection}>
      <Text style={styles.profileTitle}>Borrowed Books</Text>
      <FlatList
       style={{marginLeft:10}}
        data={borrowHistoryObjects.reverse()}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyProfile}>No books yet... Go borrow!</Text>}
      />
    </View>

    {/* Favorite Books */}
    <View style={styles.profileSection}>
      <Text style={styles.profileTitle}>Favorite Books</Text>
      <FlatList
         style={{marginLeft:10}}
        data={favoriteBooksList.reverse()}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.emptyProfile}>No favorites yet.</Text>}
      />
    </View>
  </ScrollView>
    </SafeAreaView>
  );
};

