// components/BookItem.tsx
import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import { Context } from '../props and context/context';
import { Book } from '../props and context/context';
import { useContext } from 'react';
import { styles } from '../styles/Stylesheet';
export const BookItem = ( book: Book ) => {
  const { favoriteBooksList, toggleFavorite } = useContext(Context);
  const isFavorited = favoriteBooksList.some(b => b.id === book.id);

  return (
    <View style={{ flex: 1, margin: 5, alignItems: 'center', justifyContent: 'center' }}>
      {/* Book Cover */}
      <Image
        source={{ uri: book.cover }}
        style={{
          width: '100%',
          aspectRatio: 2 / 3,
          resizeMode: 'cover',
          borderRadius: 8,
        }}
      />

      {/* Title */}
      <Text numberOfLines={1} style={styles.bookTitle}>
        {book.title}
      </Text>

      {/* Author */}
      <Text numberOfLines={1} style={styles.bookAuthor}>
        By: {book.author}
      </Text>

      {/* Favorite Toggle */}
      <TouchableOpacity
        onPress={() => toggleFavorite(book.id)}
        style={{ alignSelf: 'flex-end', marginRight: 10, marginBottom: 10 }}
      >
        <Text>{isFavorited ? '⭐' : '✩'}</Text>
      </TouchableOpacity>
    </View>
  );
};