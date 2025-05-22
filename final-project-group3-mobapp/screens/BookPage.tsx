import React, { useContext } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Context } from "../props and context/context";
import { styles } from "../styles/Stylesheet";
const BookPage = () => {
    const { selectedBook, books, logs, currentAccount} = useContext(Context);

    const book = books.find((book) => book.id === selectedBook);
    const bookBorrowingLog = logs.find((log) => log.userid == currentAccount && log.bookid === book?.id);
    const isCheckedOut = bookBorrowingLog?.dateLent && !bookBorrowingLog?.dateReturned;
    const isRequested = bookBorrowingLog?.dateRequested && !bookBorrowingLog?.dateLent;
    const isAvailable = (book?.copies ?? 0) > 0; // if no more copies, default to zero
            console.log('Book cover:', book?.cover);

    return (
        <View style={styles.container}>
            {book &&
            <View style={[]}>
                <Image
                     source={{ uri: book.cover }}
                  style={{ width: '100%', height: 200, resizeMode: 'contain', borderRadius: 8 }}
                />
                <Text style={[]}>Title: {book ? book.title: ""}</Text>
                <Text style={[]}>Author: {book ? book.author: ""}</Text>
                 <Text style={[]}>Genres: {book ? book.genres: ""}</Text>
                <Text style={[]}> {book ? book.synopsis: ""}</Text>
                <Text style={[]}>Publisher: {book ? book.publisher: ""}</Text>
                <Text style={[]}>{book ? book.year: ""}</Text>
                <Text style={[]}>ISBN {book ? book.isbn: ""}</Text>
                <Text style={[]}>Edition: {book ? book.edition: ""}</Text>
                <Text style={[]}>Edition: {book ? book.edition: ""}</Text>

            </View>
             }

            <TouchableOpacity
  onPress={() => {
    if (!isAvailable) return; // Prevent action if not available
    //{ book && toggleBorrow(book.id)};
  }}
  style={{
    backgroundColor: !isAvailable
      ? '#999'
      : isCheckedOut
      ? '#d9534f'
      : isRequested
      ? '#f0ad4e'
      : '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
    opacity: !isAvailable ? 0.6 : 1,
  }}
  disabled={!isAvailable}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>
    {!isAvailable
      ? 'Unavailable'
      : isCheckedOut
      ? 'Return'
      : isRequested
      ? 'Requested'
      : 'Borrow'}
  </Text>
</TouchableOpacity>
        </View>
    )
}
export default BookPage;