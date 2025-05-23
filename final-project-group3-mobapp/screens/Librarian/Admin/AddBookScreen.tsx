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
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Context } from '../../../props and context/context';
import { Book } from '../../../props and context/context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { styles } from '../../../styles/Stylesheet';
import dayjs from 'dayjs';

export default function AddBookScreen() {
  const navigation = useNavigation(); // still okay to use without types
  const { addBooks, setSelectedBookId, selectedBook, books, updateBooks, logs } = useContext(Context);
  const [id, setId] = useState('');
  const [cover, setCover] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [isbn, setIsbn] = useState('');
  const [edition, setEdition] = useState('');
  const [genres, setGenres] = useState('');
  const [copies, setCopies] = useState('');

  const isEditing = !!selectedBook;
  const currentBook = books.find(b => b.id === selectedBook);

  // 📥 Load existing book data when editing
  useEffect(() => {
    if (!currentBook) return;

    setCover(currentBook.cover || '');
    setTitle(currentBook.title || '');
    setAuthors(currentBook.author || '');
    setSynopsis(currentBook.synopsis || '');
    setPublisher(currentBook.publisher || '');
    setYear(currentBook.year.toString() || '');
    setAcquisitionDate(currentBook.acqDate || '');
    setIsbn(currentBook.isbn || '');
    setEdition(currentBook.edition?.toString() || '');
    setGenres(currentBook.genres || '');
    setCopies(currentBook.copies?.toString() || '');

    console.log(currentBook)
  }, [selectedBook]);






  const BookSchema = Yup.object().shape({
    id: Yup.string()
      .required('ID is required')
      .test(
        'unique-id',
        'This ID already exists',
        function (value) {
          const { currentBook } = this.options.context as { currentBook?: Book };

          // If no value, let required handle it
          if (!value) return true;

          // If editing and ID matches current book's ID → allow it
          if (currentBook && value === currentBook.id) return true;

          // Otherwise check uniqueness
          return !books.map(b => b.id).includes(value);
        }
      ),
    title: Yup.string().required('Title is required'),
    authors: Yup.string().required('Author(s) are required'),
    genres: Yup.string().required('Genre(s) are required'),
    year: Yup.number()
      .typeError('Year must be a number')
      .integer('Must be a valid year')
      .required('Publication Year is required')
      .min(0, "Year is out range")
      .max(dayjs().year(), "Year is out range"),
    copies: Yup.number()
      .typeError('Copies must be a number')
      .min(1, 'Must have atleast 1 copy')
      .required('Copies are required'),
    isbn: Yup.string().required().test(
      'valid-isbn-length',
      'ISBN must be 10 or 13 digits (without dashes)',
      (value) => {
        const cleanValue = value?.replace(/[^0-9]/g, '');
        return cleanValue == null || cleanValue.length === 10 || cleanValue.length === 13;
      }
    ),
    synopsis: Yup.string().required(),
    edition: Yup.number().optional(),
    cover: Yup.string().required('Image is required'),
  });

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
          <View style={{ width: '100%' }}>


            {/* Formik Form */}
            <Formik
              initialValues={{
                id: currentBook?.id || (books.length + 1).toString(),
                cover: currentBook?.cover || '',
                title: currentBook?.title || '',
                authors: currentBook?.author || '',
                synopsis: currentBook?.synopsis || '',
                publisher: currentBook?.publisher || '',
                year: currentBook?.year?.toString() || '',
                acqDate: currentBook?.acqDate || dayjs().year().toString(),
                isbn: currentBook?.isbn || '',
                edition: currentBook?.edition?.toString() || '',
                genres: currentBook?.genres || '',
                copies: currentBook?.copies?.toString() || '',
                availability: currentBook?.availability
              }}
              validationSchema={BookSchema}
              onSubmit={(values) => {
                console.log("Submitted")

                const baseData = {
                  id: values.id,
                  cover: values.cover,
                  title: values.title,
                  author: values.authors,
                  synopsis: values.synopsis,
                  publisher: values.publisher,
                  year: values.year,
                  acqDate: values.acqDate,
                  isbn: values.isbn,
                  edition: values.edition,
                  genres: values.genres,
                  copies: parseInt(values.copies),
                  availability: true,
                };

                if (isEditing && selectedBook && currentBook) {
                  updateBooks(selectedBook, baseData);
                } else {
                  const newID = (logs.length + 1).toString();
                  addBooks({ ...baseData, id: newID });
                }

                navigation.goBack();
              }}
            >

              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
                console.log(errors);
                const pickImage = async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 1
                  });

                  if (!result.canceled) {
                    setFieldValue('cover', result.assets[0].uri); // ✅ Now uses Formik's built-in updater
                  }
                };

                return (
                  <View style={{ width: '100%' }}>
                    {/* Pick Cover Button */}
                    <TouchableOpacity
                      onPress={() => pickImage()}
                      style={{
                        backgroundColor: '#007BFF',
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginBottom: 10,
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Pick Cover Image</Text>
                    </TouchableOpacity>

                    {/* Show Preview Using Formik Values */}
                    {values.cover && (
                      <Image
                        source={{ uri: values.cover }}
                        style={{ width: 100, height: 150, alignSelf: 'center', marginVertical: 10 }}
                      />
                    )}

                    {/* Optional: Show validation error */}
                    {touched.cover && errors.cover ? (
                      <Text style={styles.errorStyle}>{errors.cover}</Text>
                    ) : null}

                    {/* ID Field */}
                    <Text style={styles.labelStyle}>ID</Text>
                    <TextInput
                      placeholder="Enter book ID"
                      value={values.id}
                      onChangeText={handleChange('id')}
                      onBlur={handleBlur('id')}
                      style={inputStyle}
                    />
                    {touched.id && errors.id ? (
                      <Text style={styles.errorStyle}>{errors.id}</Text>
                    ) : null}

                    {/* Title */}
                    <Text style={styles.labelStyle}>Title</Text>
                    <TextInput
                      placeholder="Enter book title"
                      value={values.title}
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                      style={inputStyle}
                    />
                    {touched.title && errors.title ? (
                      <Text style={styles.errorStyle}>{errors.title}</Text>
                    ) : null}

                    {/* Authors */}
                    <Text style={styles.labelStyle}>Authors</Text>
                    <TextInput
                      placeholder="Enter author(s)"
                      value={values.authors}
                      onChangeText={handleChange('authors')}
                      onBlur={handleBlur('authors')}
                      style={inputStyle}
                    />
                    {touched.authors && errors.authors ? (
                      <Text style={styles.errorStyle}>{errors.authors}</Text>
                    ) : null}

                    {/* Publication Year */}
                    <Text style={styles.labelStyle}>Publication Year</Text>
                    <TextInput
                      placeholder="YYYY"
                      value={values.year}
                      onChangeText={handleChange('year')}
                      onBlur={handleBlur('year')}
                      keyboardType="numeric"
                      style={inputStyle}
                    />
                    {touched.year && errors.year ? (
                      <Text style={styles.errorStyle}>{errors.year}</Text>
                    ) : null}

                    {/* Copies */}
                    <Text style={styles.labelStyle}>Copies</Text>
                    <TextInput
                      placeholder="Number of available copies"
                      value={values.copies}
                      onChangeText={handleChange('copies')}
                      onBlur={handleBlur('copies')}
                      keyboardType="numeric"
                      style={inputStyle}
                    />
                    {touched.copies && errors.copies ? (
                      <Text style={styles.errorStyle}>{errors.copies}</Text>
                    ) : null}

                    {/* Other fields without validation */}
                    <Text style={styles.labelStyle}>Synopsis</Text>
                    <TextInput
                      placeholder="Enter short description"
                      value={values.synopsis}
                      onChangeText={handleChange('synopsis')}
                      onBlur={handleBlur('synopsis')}
                      style={[inputStyle, { height: 100, textAlignVertical: 'top' }]}
                      multiline
                      numberOfLines={4}
                    />

                    {touched.copies && errors.copies ? (
                      <Text style={styles.errorStyle}>{errors.copies}</Text>
                    ) : null}


                    <Text style={styles.labelStyle}>Publisher</Text>
                    <TextInput
                      placeholder="Enter publisher"
                      value={values.publisher}
                      onChangeText={handleChange('publisher')}
                      onBlur={handleBlur('publisher')}
                      style={inputStyle}
                    />

                    {touched.publisher && errors.publisher ? (
                      <Text style={styles.errorStyle}>{errors.publisher}</Text>
                    ) : null}

                    <Text style={styles.labelStyle}>Acquisition Date</Text>
                    <TextInput
                      placeholder="MM/DD/YYYY"
                      value={values.acqDate}
                      onChangeText={handleChange('acqDate')}
                      onBlur={handleBlur('acqDate')}
                      style={inputStyle}
                    />

                    <Text style={styles.labelStyle}>ISBN</Text>
                    <TextInput
                      placeholder="Enter ISBN (optional)"
                      value={values.isbn}
                      onChangeText={handleChange('isbn')}
                      onBlur={handleBlur('isbn')}
                      style={inputStyle}
                    />
                    {touched.isbn && errors.isbn ? (
                      <Text style={styles.errorStyle}>{errors.isbn}</Text>
                    ) : null}

                    <Text style={styles.labelStyle}>Edition Number</Text>
                    <TextInput
                      placeholder="e.g., 1st Edition"
                      value={values.edition}
                      onChangeText={handleChange('edition')}
                      onBlur={handleBlur('edition')}
                      keyboardType="numeric"
                      style={inputStyle}
                    />

                    <Text style={styles.labelStyle}>Genres</Text>
                    <TextInput
                      placeholder="Fiction, Fantasy, etc."
                      value={values.genres}
                      onChangeText={handleChange('genres')}
                      onBlur={handleBlur('genres')}
                      style={inputStyle}
                    />
                    {touched.genres && errors.genres ? (
                      <Text style={styles.errorStyle}>{errors.genres}</Text>
                    ) : null}

                    {touched && errors ? (
                      <Text style={styles.errorStyle}>Resolve Errors first!</Text>
                    ) : null}
                    {/* Submit Button */}
                    <TouchableOpacity
                      onPress={() => handleSubmit()}
                      style={{
                        backgroundColor: '#28a745',
                        paddingVertical: 14,
                        borderRadius: 8,
                        alignItems: 'center',
                        marginTop: 20,
                      }}
                    >

                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                        {isEditing ? 'Update Book' : 'Publish'}
                      </Text>
                    </TouchableOpacity>

                  </View>
                );
              }}
            </Formik>

            {/* Cancel Button – outside Formik but still inside ScrollView */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                backgroundColor: '#dc3545',
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: 'center',
                marginTop: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const inputStyle = {
  borderBottomWidth: 1,
  marginVertical: 8,
  paddingVertical: 4
}