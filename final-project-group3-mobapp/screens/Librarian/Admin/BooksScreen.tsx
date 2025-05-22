import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert, Modal } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Context } from '../../../props and context/context';
import { styles } from '../../../styles/Stylesheet';
import * as ScreenOrientation from 'expo-screen-orientation';

//Navigation
import { NavigationProp } from '../../../props and context/navprops';
import { useNavigation } from '@react-navigation/native';

export default function BooksScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { books, updateBooks } = useContext(Context);


  const [showOrientationWarning, setShowOrientationWarning] = useState(true);
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation | null>(null);

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


  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this book?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const filteredBooks = books.filter(book => book.id !== id);
          updateBooks(filteredBooks);
          // Also update AsyncStorage here if needed
        },
      },
    ]);
  };

  const handleOptions = (id: string) => {
    Alert.alert('Options', 'Choose an action', [
      {
        text: 'Edit',
        //onPress: () => navigation.navigate('EditBook', { bookId: id }),
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => handleDelete(id),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

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


  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.headerTitle}>Librarian Books</Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: 'red',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('AddBook')}
        style={[styles.buttonContainer, { margin: 20, alignSelf: 'center' }]}
      >
        <Text style={styles.buttonText}>Add New Book</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {books.map(book => (
          <View key={book.id} style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{book.title}</Text>
              <Text>Author(s): {book.author}</Text>
              {book.cover ? <Image source={{ uri: book.cover }} style={{ width: 100, height: 150 }} /> : null}
            </View>
            <TouchableOpacity
              onPress={() => handleOptions(book.id)}
              style={{ padding: 10 }}
              accessibilityLabel="Options"
            >
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>⋮</Text>
            </TouchableOpacity>
          </View>
        ))}


      </ScrollView>

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
    </SafeAreaView>
  );
};
