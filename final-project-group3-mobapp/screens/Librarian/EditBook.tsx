import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, ScrollView, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Context, Book } from '../../props and context/context';
import { styles } from '../../styles/Stylesheet';

// Define navigation param list (add EditBook here)
type RootStackParamList = {
  Books: undefined;
  EditBook: { book: Book };
  // ... other screens
};

type EditBookRouteProp = RouteProp<RootStackParamList, 'EditBook'>;

const EditBook = () => {
  const { updateBooks, books } = useContext(Context);
  const navigation = useNavigation();
  const route = useRoute<EditBookRouteProp>();

  const book = route.params.book;

  // Local state for editable fields
  const [title, setTitle] = useState(book.title);
  const [authors, setAuthors] = useState(book.authors);
  const [synopsis, setSynopsis] = useState(book.synopsis);
  const [cover, setCover] = useState(book.cover);
  const [publisher, setPublisher] = useState(book.publisher);
  const [year, setYear] = useState(book.year);
  const [acquisitionDate, setAcquisitionDate] = useState(book.acquisitionDate);
  const [isbn, setIsbn] = useState(book.isbn);
  const [edition, setEdition] = useState(book.edition);
  const [genres, setGenres] = useState(book.genres);
  const [copies, setCopies] = useState(String(book.copies));
  const [available, setAvailable] = useState(String(book.available));

  const handleSave = async () => {
    // Basic validation example
    if (!title.trim() || !authors.trim()) {
      Alert.alert('Error', 'Title and Authors are required.');
      return;
    }

    // Create updated book object
    const updatedBook: Book = {
      ...book,
      title,
      authors,
      synopsis,
      cover,
      publisher,
      year,
      acquisitionDate,
      isbn,
      edition,
      genres,
      copies: Number(copies),
      available: Number(available),
    };

    // Update book list
    const updatedBooks = books.map(b => (b.id === book.id ? updatedBook : b));
    await updateBooks(updatedBooks);

    Alert.alert('Success', 'Book updated successfully!');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: 10 }}>
        <Text style={styles.headerTitle}>Edit Book</Text>

        <Text>Title:</Text>
        <TextInput value={title} onChangeText={setTitle} style={styles.input} />

        <Text>Authors:</Text>
        <TextInput value={authors} onChangeText={setAuthors} style={styles.input} />

        <Text>Synopsis:</Text>
        <TextInput value={synopsis} onChangeText={setSynopsis} style={[styles.input, { height: 80 }]} multiline />

        <Text>Cover URL:</Text>
        <TextInput value={cover} onChangeText={setCover} style={styles.input} />

        <Text>Publisher:</Text>
        <TextInput value={publisher} onChangeText={setPublisher} style={styles.input} />

        <Text>Year:</Text>
        <TextInput value={year} onChangeText={setYear} style={styles.input} keyboardType="numeric" />

        <Text>Acquisition Date:</Text>
        <TextInput value={acquisitionDate} onChangeText={setAcquisitionDate} style={styles.input} />

        <Text>ISBN:</Text>
        <TextInput value={isbn} onChangeText={setIsbn} style={styles.input} />

        <Text>Edition:</Text>
        <TextInput value={edition} onChangeText={setEdition} style={styles.input} />

        <Text>Genres:</Text>
        <TextInput value={genres} onChangeText={setGenres} style={styles.input} />

        <Text>Copies:</Text>
        <TextInput value={copies} onChangeText={setCopies} style={styles.input} keyboardType="numeric" />

        <Text>Available:</Text>
        <TextInput value={available} onChangeText={setAvailable} style={styles.input} keyboardType="numeric" />

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
          <Button title="Save" onPress={handleSave} />
          <Button title="Cancel" onPress={() => navigation.goBack()} color="gray" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditBook;
