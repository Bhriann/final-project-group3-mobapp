import React, { useContext, useState, useEffect, } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image, Alert, Modal, useWindowDimensions } from 'react-native';

import { Context } from '../../../props and context/context';
import { styles } from '../../../styles/Stylesheet';
import * as ScreenOrientation from 'expo-screen-orientation';

//Navigation
import { NavigationProp } from '../../../props and context/navprops';
import { useNavigation } from '@react-navigation/native';

export default function BooksScreen() {

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const navigation = useNavigation<NavigationProp>();
  const { books, deleteBooks, setSelectedBookId } = useContext(Context);

  const [showOrientationWarning, setShowOrientationWarning] = useState(true);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);

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

  return (
    <SafeAreaView style={[styles.container, { paddingRight: 20, paddingLeft: isLandscape ? 60 : 20 }]}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.title}>Librarian Books</Text>

        <TouchableOpacity
          onPress={() => { setSelectedBookId(""); navigation.navigate('AddBook') }}
          style={[styles.buttonContainer, { margin: 20, alignSelf: 'center' }]}
        >
          <Text style={styles.buttonText}>Add New Book</Text>
        </TouchableOpacity>
      </View>
      {/* Table Header */}
      <View style={[styles.table_header]}>
        <Text numberOfLines={1} style={[styles.heading]}>ID</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Cover</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Title</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Author(s)</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Synopsis</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Publisher</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Year</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Acquisition Date</Text>
        <Text numberOfLines={1} style={[styles.heading]}>ISBN</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Edition</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Genres</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Copies</Text>
        <Text numberOfLines={1} style={[styles.heading]}></Text>
        <Text numberOfLines={1} style={[styles.heading]}></Text>
      </View>

      <FlatList
        data={books}
        style={{ flex: 1 }}
        keyExtractor={(item) => item.id}
        extraData={books}
        ListEmptyComponent={<Text style={{ textAlign: "center", padding: 20 }}>No Logs Match...</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {/* ID */}
            <Text numberOfLines={1} style={styles.cell}>{item.id}</Text>

            {/* Cover */}
            <Text numberOfLines={1} style={styles.cell}>{item.cover}  </Text>

            {/* Title */}
            <Text numberOfLines={1} style={styles.cell}>{item.title}</Text>

            {/* Author */}
            <Text numberOfLines={1} style={styles.cell}>{item.author}</Text>

            {/* Synopsis */}
            <Text numberOfLines={1} style={styles.cell}>{item.synopsis}</Text>

            {/* Publisher */}
            <Text numberOfLines={1} style={styles.cell}>{item.publisher}</Text>

            {/* Year */}
            <Text numberOfLines={1} style={styles.cell}>{item.year}</Text>

            {/* Acq Date */}
            <Text numberOfLines={1} style={styles.cell}>{item.acqDate}</Text>

            {/* ISBN */}
            <Text numberOfLines={1} style={styles.cell}>{item.isbn}</Text>

            {/* Edition */}
            <Text numberOfLines={1} style={styles.cell}>{item.edition}</Text>

            {/* Genres */}
            <Text numberOfLines={1} style={styles.cell}>{item.genres}</Text>

            {/* Available Copies */}
            <Text numberOfLines={1} style={styles.cell}>{item.copies}</Text>

            {/* Action Buttons */}

            <View style={styles.actionCell}>
              <TouchableOpacity onPress={() => handleOnEdit(item.id)}>
                <Text>View</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actionCell}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text>Delete</Text>
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
