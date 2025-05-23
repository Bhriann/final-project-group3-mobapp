import React, { useContext } from "react";
import { View, SafeAreaView, Text, Image, Alert, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { Context } from "../../props and context/context";
import { styles } from "../../styles/Stylesheet";
import dayjs from "dayjs";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";


const { height } = Dimensions.get('window');
const BookPage = () => {
  const navigation = useNavigation();
  const { toggleFavorite, favoriteBooksList, selectedBook, books, logs, currentAccount, updateBooks, setLogs, users, admin, librarians } = useContext(Context);

  const isUser = currentAccount?.slice(0, 2) === "US";

  // Find the current book
  const book = books.find(b => b.id === selectedBook);
  if (!book) {
    return (
      <View style={styles.container}>
        <Text>No book selected</Text>
      </View>
    );
  }

  // Find borrowing history for this book by current user
  const borrowLogForBook = logs
    .filter(log => log.bookid === book?.id && log.userid === currentAccount)
    .sort((a, b) => new Date(b.dateRequested).getTime() - new Date(a.dateRequested).getTime())
  [0]; // get most recent log

  const isLent = !!(
    borrowLogForBook &&
    borrowLogForBook.dateLent &&
    !borrowLogForBook.dateReturned
  );

  const isRequested = !!(
    borrowLogForBook &&
    borrowLogForBook.dateRequested &&
    !borrowLogForBook.dateLent
  );

  const isAvailable = (book?.copies ?? 0) > 0;
  const isFavorited = favoriteBooksList.some(b => b.id === book.id);
  const handleBorrowPress = () => {
    const targetBook = books.find(b => b.id === selectedBook);

    if (!targetBook) {
      Alert.alert("Error", "Book not found");
      return;
    }

    if (targetBook.copies <= 0 || !targetBook.availability) {
      Alert.alert("Unavailable", "No more copies of this book");
      return;
    }

    const newLog = {
      id: (logs.length + 1).toString(),
      bookid: book?.id || '',
      userid: currentAccount,
      dateRequested: dayjs().toISOString(),
      dateLent: undefined,
      dateReturned: undefined,
    };

    const updatedBook = {
      copies: targetBook.copies - 1,
      availability: (targetBook.copies - 1) > 0,
    };

    updateBooks(targetBook.id, updatedBook);
    setLogs(prev => [...prev, newLog]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFEFCA" }]}>
      <View style={{
        width: '100%',
        height: '25%',
        overflow: 'hidden',
        borderBottomStartRadius: 16,
        borderBottomEndRadius: 16,
      }}>
        <Image
          source={{ uri: book.cover }}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'cover',
          }}
        />

        {/* ✅ Gradient Overlay */}
        <LinearGradient
          colors={[  'rgba(0,0,0,0.7)','rgba(0,0,0,0.3)','transparent',]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      {/* 🧱 Top Bar with Back & Favorite */}
      <View
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          zIndex: 10,
          alignItems: "center"
        }}
      >


        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>←</Text>
        </TouchableOpacity>

        {/* Favorite Button - only for regular users */}
        {isUser && (
          <TouchableOpacity
            onPress={() => toggleFavorite(book.id)}
            style={{
              backgroundColor: isFavorited ? '#777' : '#535FAB',
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 20,
            }}
          >
            <Text style={{ color: '#C9C9C9', fontWeight: 'bold' }}>
              {isFavorited ? '⭐ Unfavorite' : '✩ Favorite'}
            </Text>
          </TouchableOpacity>
        )}
        
      </View>

      </View>


      {/* 📚 Scrollable Info Below */}
      <ScrollView contentContainerStyle={styles.scrollInfo}>
        <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
          <Text style={styles.infotitle}>{book.title}</Text>
          <Text style={styles.infoyear}>{book.year}</Text>
        </View>

        <Text style={styles.author}>{book.author}</Text>
        <Text style={styles.info}>Genres: {book.genres}</Text>
        <Text style={styles.synopsis}>{book.synopsis}</Text>

        <Text style={styles.info}>Publisher: {book.publisher}</Text>
        <Text style={styles.info}>ISBN: {book.isbn}</Text>
        <Text style={styles.info}>Edition: {book.edition}</Text>

        {/* Borrow Button */}
        <TouchableOpacity
          onPress={handleBorrowPress}
          disabled={!isAvailable || isLent || isRequested}
          style={{
            backgroundColor: isLent ? '#f0ad4e' : isRequested ? '#d9534f' : isAvailable ? '#4CAF50' : '#999',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginTop: 20,
            alignSelf: 'center',
            width: '60%',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {isLent
              ? 'Checked-Out'
              : isRequested
                ? 'Requested'
                : !isAvailable
                  ? 'Unavailable'
                  : 'Borrow'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>

  );
};

export default BookPage;