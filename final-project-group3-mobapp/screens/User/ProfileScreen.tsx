import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/Stylesheet';
import { Context } from '../../props and context/context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const { 
    books, 
    borrowedBooks, 
    favoriteBooks, 
    toggleBorrow, 
    toggleFavorite,
    currentAccount 
  } = useContext(Context);
  
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<'borrowed' | 'favorites'>('borrowed');

  // Get the actual book objects for borrowed and favorite books
  const borrowedBookObjects = books.filter(book => borrowedBooks.includes(book.id));
  const favoriteBookObjects = books.filter(book => favoriteBooks.includes(book.id));

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.headerTitle}>
          {currentAccount || 'User'}'s Profile
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          style={{ backgroundColor: 'red', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 5 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Buttons */}
      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 15,
            backgroundColor: activeTab === 'borrowed' ? '#4CAF50' : '#e0e0e0',
            alignItems: 'center',
          }}
          onPress={() => setActiveTab('borrowed')}
        >
          <Text style={{ color: activeTab === 'borrowed' ? 'white' : 'black' }}>
            Borrowed Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 15,
            backgroundColor: activeTab === 'favorites' ? '#2196F3' : '#e0e0e0',
            alignItems: 'center',
          }}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={{ color: activeTab === 'favorites' ? 'white' : 'black' }}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {activeTab === 'borrowed' ? (
          <>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Your Borrowed Books ({borrowedBookObjects.length})
            </Text>
            {borrowedBookObjects.length > 0 ? (
              borrowedBookObjects.map(book => (
                <View
                  key={book.id}
                  style={{
                    backgroundColor: '#f9f9f9',
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                    {book.title}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
                    By: {book.author}
                  </Text>
                  {book.cover ? (
                    <Image
                      source={{ uri: book.cover }}
                      style={{ width: '100%', height: 200, resizeMode: 'contain', borderRadius: 8 }}
                    />
                  ) : (
                    <Text style={{ color: '#aaa' }}>[ No Cover Image ]</Text>
                  )}
                  <TouchableOpacity
                    onPress={() => toggleBorrow(book.id)}
                    style={{
                      backgroundColor: '#d9534f',
                      paddingVertical: 8,
                      paddingHorizontal: 15,
                      borderRadius: 5,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Return</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Ionicons name="book-outline" size={50} color="#ccc" />
                <Text style={{ textAlign: 'center', color: '#555', marginTop: 10 }}>
                  You haven't borrowed any books yet.
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Your Favorite Books ({favoriteBookObjects.length})
            </Text>
            {favoriteBookObjects.length > 0 ? (
              favoriteBookObjects.map(book => (
                <View
                  key={book.id}
                  style={{
                    backgroundColor: '#f9f9f9',
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                    {book.title}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
                    By: {book.author}
                  </Text>
                  {book.cover ? (
                    <Image
                      source={{ uri: book.cover }}
                      style={{ width: '100%', height: 200, resizeMode: 'contain', borderRadius: 8 }}
                    />
                  ) : (
                    <Text style={{ color: '#aaa' }}>[ No Cover Image ]</Text>
                  )}
                  <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <TouchableOpacity
                      onPress={() => toggleBorrow(book.id)}
                      style={{
                        backgroundColor: borrowedBooks.includes(book.id) ? '#d9534f' : '#4CAF50',
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        borderRadius: 5,
                        marginRight: 10,
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        {borrowedBooks.includes(book.id) ? 'Return' : 'Borrow'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleFavorite(book.id)}
                      style={{
                        backgroundColor: '#777',
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        borderRadius: 5,
                      }}
                    >
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Unfavorite</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Ionicons name="heart-outline" size={50} color="#ccc" />
                <Text style={{ textAlign: 'center', color: '#555', marginTop: 10 }}>
                  You haven't favorited any books yet.
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
