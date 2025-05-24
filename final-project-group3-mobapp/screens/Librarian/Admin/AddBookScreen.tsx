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
  Keyboard,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Context } from '../../../props and context/context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { styles } from '../../../styles/Stylesheet';
import dayjs from 'dayjs';

export default function AddBookScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const navigation = useNavigation();
  const {
    addBooks,
    updateBooks,
    setSelectedBookId,
    selectedBook,
    books,
    logs,
  } = useContext(Context);

  const [cover, setCover] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState(dayjs().format('MM/DD/YYYY'));
  const [isbn, setIsbn] = useState('');
  const [edition, setEdition] = useState('');
  const [genres, setGenres] = useState('');
  const [copies, setCopies] = useState('');

  const isEditing = !!selectedBook;
  const currentBook = books.find(b => b.id === selectedBook);

  // Load existing book data when editing
  useEffect(() => {
    if (!currentBook) return;

    setCover(currentBook.cover || '');
    setTitle(currentBook.title || '');
    setAuthors(currentBook.author || '');
    setSynopsis(currentBook.synopsis || '');
    setPublisher(currentBook.publisher || '');
    setYear(currentBook.year?.toString() || '');
    setAcquisitionDate(currentBook.acqDate || dayjs().format('MM/DD/YYYY'));
    setIsbn(currentBook.isbn || '');
    setEdition(currentBook.edition?.toString() || '');
    setGenres(currentBook.genres || '');
    setCopies(currentBook.copies?.toString() || '');
  }, [selectedBook]);

  // Generate unique ID
  const generateNewId = () => {
    const ids = books.map(b => parseInt(b.id)).filter(id => !isNaN(id));
    const maxId = ids.length ? Math.max(...ids) : 0;
    return (maxId + 1).toString();
  };

  // Unified schema
  const BookSchema = Yup.object().shape({
    id: Yup.string()
      .required('ID is required')
      .test('unique-id', 'This ID already exists', function (value) {
        if (!value) return true;
        if (currentBook && value === currentBook.id) return true;
        return !books.some(b => b.id === value);
      }),
    title: Yup.string().required('Title is required'),
    authors: Yup.string().required('Author(s) are required'),
    genres: Yup.string().required('Genre(s) are required'),
    year: Yup.number()
      .typeError('Year must be a number')
      .integer('Must be a valid year')
      .required('Publication Year is required')
      .min(0, "Year is out of range")
      .max(dayjs().year(), "Year cannot be in the future"),
    copies: Yup.number()
      .typeError('Copies must be a number')
      .min(1, 'Must have at least 1 copy')
      .required('Copies are required'),
    isbn: Yup.string().test(
      'valid-isbn-length',
      'ISBN must be 10 or 13 digits (without dashes)',
      (value) => {
        const cleanValue = value?.replace(/[^0-9]/g, '');
        return cleanValue == null || cleanValue.length === 10 || cleanValue.length === 13;
      }
    ).optional(),
    edition: Yup.number().optional(),
    cover: Yup.string().required('Image is required'),
  });

  return (
    <SafeAreaView style={[styles.container, { paddingRight: 20, paddingLeft: isLandscape ? 60 : 20 }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
            {/* Formik Form */}
            <Formik
              initialValues={{
                id: currentBook?.id ? currentBook?.id : generateNewId(),
                cover: currentBook?.cover || '',
                title: currentBook?.title || '',
                authors: currentBook?.author || '',
                synopsis: currentBook?.synopsis || '',
                publisher: currentBook?.publisher || '',
                year: currentBook?.year?.toString() || '',
                acqDate: currentBook?.acqDate || dayjs().format('MM/DD/YYYY'),
                isbn: currentBook?.isbn || '',
                edition: currentBook?.edition?.toString() || '',
                genres: currentBook?.genres || '',
                copies: currentBook?.copies?.toString() || '',
              }}
              validationSchema={BookSchema}
              onSubmit={(values) => {
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

                if (isEditing && currentBook) {
                  updateBooks(currentBook.id, {
                    ...baseData,
                  });

                } else {
                  const newID = generateNewId(); // Use safe ID generator
                  addBooks({ ...baseData, id: newID });
                }
                Alert.alert("Succesfully Updated Book Archives")
                navigation.goBack();
              }}
              enableReinitialize
              context={{ currentBook }} // Pass context for Yup
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
                const pickImage = async () => {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    quality: 1,
                  });
                  if (!result.canceled) {
                    setFieldValue('cover', result.assets[0].uri);
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
                    {touched.cover && errors.cover && (
                      <Text style={styles.errorStyle}>{errors.cover}</Text>
                    )}

                    {/* ID Field */}
                    <Text style={styles.labelStyle}>ID</Text>
                    <TextInput
                      placeholder="Enter book ID"
                      value={values.id}
                      onChangeText={handleChange('id')}
                      onBlur={handleBlur('id')}
                      style={inputStyle}
                    />
                    {touched.id && errors.id && (
                      <Text style={styles.errorStyle}>{errors.id}</Text>
                    )}

                    {/* Title */}
                    <Text style={styles.labelStyle}>Title</Text>
                    <TextInput
                      placeholder="Enter book title"
                      value={values.title}
                      onChangeText={handleChange('title')}
                      onBlur={handleBlur('title')}
                      style={inputStyle}
                    />
                    {touched.title && errors.title && (
                      <Text style={styles.errorStyle}>{errors.title}</Text>
                    )}

                    {/* Authors */}
                    <Text style={styles.labelStyle}>Authors</Text>
                    <TextInput
                      placeholder="Enter author(s)"
                      value={values.authors}
                      onChangeText={handleChange('authors')}
                      onBlur={handleBlur('authors')}
                      style={inputStyle}
                    />
                    {touched.authors && errors.authors && (
                      <Text style={styles.errorStyle}>{errors.authors}</Text>
                    )}

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
                    {touched.year && errors.year && (
                      <Text style={styles.errorStyle}>{errors.year}</Text>
                    )}

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
                    {touched.copies && errors.copies && (
                      <Text style={styles.errorStyle}>{errors.copies}</Text>
                    )}

                    {/* Synopsis */}
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
                    {touched.synopsis && errors.synopsis && (
                      <Text style={styles.errorStyle}>{errors.synopsis}</Text>
                    )}

                    {/* Publisher */}
                    <Text style={styles.labelStyle}>Publisher</Text>
                    <TextInput
                      placeholder="Enter publisher"
                      value={values.publisher}
                      onChangeText={handleChange('publisher')}
                      onBlur={handleBlur('publisher')}
                      style={inputStyle}
                    />
                    {touched.publisher && errors.publisher && (
                      <Text style={styles.errorStyle}>{errors.publisher}</Text>
                    )}

                    {/* Acquisition Date */}
                    <Text style={styles.labelStyle}>Acquisition Date</Text>
                    <TextInput
                      placeholder="MM/DD/YYYY"
                      value={values.acqDate}
                      onChangeText={handleChange('acqDate')}
                      onBlur={handleBlur('acqDate')}
                      style={inputStyle}
                    />

                    {/* ISBN */}
                    <Text style={styles.labelStyle}>ISBN</Text>
                    <TextInput
                      placeholder="Enter ISBN (optional)"
                      value={values.isbn}
                      onChangeText={handleChange('isbn')}
                      onBlur={handleBlur('isbn')}
                      style={inputStyle}
                    />
                    {touched.isbn && errors.isbn && (
                      <Text style={styles.errorStyle}>{errors.isbn}</Text>
                    )}

                    {/* Edition */}
                    <Text style={styles.labelStyle}>Edition Number</Text>
                    <TextInput
                      placeholder="e.g., 1st Edition"
                      value={values.edition}
                      onChangeText={handleChange('edition')}
                      onBlur={handleBlur('edition')}
                      keyboardType="numeric"
                      style={inputStyle}
                    />

                    {/* Genres */}
                    <Text style={styles.labelStyle}>Genres</Text>
                    <TextInput
                      placeholder="Fiction, Fantasy, etc."
                      value={values.genres}
                      onChangeText={handleChange('genres')}
                      onBlur={handleBlur('genres')}
                      style={inputStyle}
                    />
                    {touched.genres && errors.genres && (
                      <Text style={styles.errorStyle}>{errors.genres}</Text>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                      onPress={() => handleSubmit()}
                       style={styles.buttonContainer}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                        {isEditing ? 'Update Book' : 'Publish'}
                      </Text>
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                       style={{
                        marginTop: 12,
                        padding: 14,
                        backgroundColor: '#dc3545',
                        borderRadius: 8,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            </Formik>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles outside component
const inputStyle = {
  borderBottomWidth: 1,
  marginVertical: 8,
  paddingVertical: 4,
  fontSize: 16,
};