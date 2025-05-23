import React, { useContext, useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList, Alert, Modal, useWindowDimensions } from 'react-native';

import { Context } from '../../../props and context/context';
import { styles } from '../../../styles/Stylesheet';
import * as ScreenOrientation from 'expo-screen-orientation';

//Navigation
import { NavigationProp } from '../../../props and context/navprops';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


export default function BooksScreen() {

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const navigation = useNavigation<NavigationProp>();
  const { books, deleteBooks, setSelectedBookId } = useContext(Context);

  const [showOrientationWarning, setShowOrientationWarning] = useState(true);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchText, setSearchText] = useState('');

  const sortedBooks = useMemo(() => {
    const searchLower = searchText.toLowerCase();
    let filtered = books.filter((book) =>
      book.id.toLowerCase().includes(searchLower) ||
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.publisher.toLowerCase().includes(searchLower) ||
      book.genres.toLowerCase().includes(searchLower) ||
      book.year.toLowerCase().includes(searchLower) ||
      book.copies.toString().includes(searchLower)
    );

    return [...filtered].sort((a, b) => {
      if (sortOrder === 'asc') {
        return parseInt(a.id) - parseInt(b.id);
      } else {
        return parseInt(b.id) - parseInt(a.id);
      }
    });
  }, [books, sortOrder, searchText]);

  //Change Orientation
  useEffect(() => {
    const init = async () => {
      const initialOrientation = await ScreenOrientation.getOrientationAsync();
      setOrientation(initialOrientation);

      // Only show warning if initially in portrait
      if (
        initialOrientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
        initialOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN
      ) {
        setShowOrientationWarning(true);
      }

      const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
        setOrientation(event.orientationInfo.orientation);
      });

      return () => {
        subscription.remove();
      };
    };

    init();
  }, []);

  const handleChangeOrientation = async () => {
    try {
      setShowOrientationWarning(false);
      // Lock temporarily to landscape left
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

      // Unlock after a short delay to allow rotation animation
      setTimeout(async () => {
        await ScreenOrientation.unlockAsync();
      }, 10000);
    } catch (error) {
      console.warn('Failed to change orientation', error);
    }
  };


  //OPERATIONS
  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this book?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteBooks(id);
          // Also update AsyncStorage here if needed
        },
      },
    ]);
  };

  const handleOnEdit = (id: string) => {
    setSelectedBookId(id);
    navigation.navigate('AddBook')
  }
  const handleAdd = () => {
      setSelectedBookId("");
    navigation.navigate('AddBook');
  }

  return (
    <SafeAreaView style={[styles.container, { paddingRight: 20, paddingLeft: isLandscape ? 60 : 20 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>Library Archives</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          <TouchableOpacity  style={[styles.buttonContainer, { marginRight:20, alignSelf: 'center' }]} onPress={() => handleAdd()}>
            <Text style={styles.buttonText}>Add New Book</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Full Width Search Bar Below */}
      <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
          paddingHorizontal: 10,
        }}>
          <TextInput
            placeholder="Search books by id, title, author, publisher, year, genres, or copies"
            value={searchText}
            onChangeText={setSearchText}
            style={{

              paddingVertical: 5,
              fontSize: 12,
            }}
          />
        </View>
      </View>

      {/* Table Header */}
      <View style={[styles.table_header]}>
        <Text numberOfLines={1} style={[styles.heading]}>ID</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Title</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Author(s)</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Publisher</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Year</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Genres</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Copies</Text>
        <Text numberOfLines={1} style={[styles.heading]}></Text>
        <Text numberOfLines={1} style={[styles.heading]}></Text>
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={sortedBooks}
        keyExtractor={(item) => item.id}
        extraData={sortedBooks}
        ListEmptyComponent={<Text style={{ textAlign: "center", padding: 20 }}>No Logs Match...</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.cell}>{item.id}</Text>
            <Text numberOfLines={1} style={styles.cell}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.cell}>{item.author}</Text>
            <Text numberOfLines={1} style={styles.cell}>{item.publisher}</Text>
            <Text numberOfLines={1} style={styles.cell}>{item.year}</Text>
            <Text numberOfLines={1} style={styles.cell}>{item.genres}</Text>
            <Text numberOfLines={1} style={styles.cell}>{item.copies}</Text>
            <View style={styles.cell}>
              <TouchableOpacity onPress={() => handleOnEdit(item.id)}>
                <Text style={styles.view}>View</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cell}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Delete</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollLib}
      />

      {/* Orientation Warning Modal */}
      <Modal
        visible={showOrientationWarning}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOrientationWarning(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.warningText}>
              For the best experience, we recommend using landscape mode.
            </Text>
            <View style={styles.warningButtons}>
              <TouchableOpacity
                onPress={() => setShowOrientationWarning(false)}
                style={styles.dismissButton}
              >
                <Text style={styles.dismissButtonText}>Dismiss</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleChangeOrientation}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>Change to Landscape</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
};
