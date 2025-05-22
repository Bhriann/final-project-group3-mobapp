import React, { useState, useContext } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import { NavigationProp } from '../../../props and context/navprops';
import { useNavigation } from '@react-navigation/native';
import { Context } from '../../../props and context/context';


export default function AddBookScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { addBook, logs } = useContext(Context);
  const [cover, setCover] = useState('');
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [acquisitionDate, setAcquisitionDate] = useState('');
  const [isbn, setIsbn] = useState('');
  const [edition, setEdition] = useState('');
  const [genres, setGenres] = useState<string>('');
  const [copies, setCopies] = useState('1');


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1
    });
    if (!result.canceled) setCover(result.assets[0].uri);
  };

  const publishBook = () => {
    if (!title || !authors || !copies)
      return Alert.alert('Missing Fields', 'Please fill out Title, Authors, and Copies.');

    const newID = parseInt(logs[logs.length-1].id) + 1 
    addBook({
      id: newID.toString(),
      title: title,
      author: authors,
      synopsis: synopsis,
      cover: cover,
      publisher: publisher,
      year: year,
      acqDate: acquisitionDate,
      isbn: isbn,
      edition: edition,
      genres: genres,
      copies: parseInt(copies),
    });

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: '#007BFF',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 10
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Pick Cover Image</Text>
          </TouchableOpacity>

          {cover ? (
            <Image
              source={{ uri: cover }}
              style={{ width: 100, height: 150, marginVertical: 10, alignSelf: 'center' }}
            />
          ) : null}

          <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={inputStyle} />
          <TextInput placeholder="Authors" value={authors} onChangeText={setAuthors} style={inputStyle} />
          <TextInput placeholder="Synopsis" value={synopsis} onChangeText={setSynopsis} style={inputStyle} />
          <TextInput placeholder="Publisher" value={publisher} onChangeText={setPublisher} style={inputStyle} />
          <TextInput
            placeholder="Publication Year"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            style={inputStyle}
          />
          <TextInput placeholder="Date of Acquisition" value={acquisitionDate} onChangeText={setAcquisitionDate} style={inputStyle} />
          <TextInput placeholder="ISBN" value={isbn} onChangeText={setIsbn} style={inputStyle} />
          <TextInput
            placeholder="Edition Number"
            value={edition}
            onChangeText={setEdition}
            keyboardType="numeric"
            style={inputStyle}
          />
          <TextInput placeholder="Genres" value={genres} onChangeText={setGenres} style={inputStyle} />
          <TextInput
            placeholder="Copies"
            value={copies}
            onChangeText={setCopies}
            keyboardType="numeric"
            style={inputStyle}
          />

          <TouchableOpacity
            onPress={publishBook}
            style={{
              backgroundColor: '#28a745',
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 20
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Publish</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              backgroundColor: '#dc3545',
              paddingVertical: 14,
              borderRadius: 8,
              alignItems: 'center',
              marginTop: 12
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const inputStyle = {
  borderBottomWidth: 1,
  marginVertical: 8,
  paddingVertical: 4
};

