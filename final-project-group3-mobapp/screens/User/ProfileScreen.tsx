import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { styles } from '../../styles/Stylesheet';
import { Context } from '../../props and context/context';
import { Book } from '../../props and context/context';

//Navigation
import { useNavigation } from '@react-navigation/native';
import BookPage from '../BookPage';
import { NavigationProp } from '../../props and context/navprops';


export default function ProfileScreen() {
const navigation = useNavigation<NavigationProp>();
  const { logs, books, favoriteBooks, currentAccount, setSelectedBookId, favoriteBooksList, borrowHistory, users} = useContext(Context);

  const [activeTab, setActiveTab] = useState<'borrowed' | 'favorites'>('borrowed');

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleBookOnPress = (item:string) => {setSelectedBookId(item); navigation.navigate('BookPage')}

  const renderBookItem = ({ item }: { item: Book }) => {
    return (
      <TouchableOpacity
        onPress={() => handleBookOnPress(item.id)}
        style={{ marginRight: 10 }}
      >
        <Image
          source={{ uri: item.cover || 'https://via.placeholder.com/150 ' }}
          style={{
            width: 120,
            height: 180,
            resizeMode: 'cover',
            borderRadius: 8,
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150 ' }} // Replace with real avatar URL or use placeholder
          style={styles.avatar}
        />
        <Text style={styles.userName}>{users.find((user) => user.id === currentAccount)?.username}</Text>
        <Text style={styles.userEmail}>{users.find((user) => user.id === currentAccount)?.email}</Text>
      </View>

      {/* Borrowed Books */}
<View style={{ marginBottom: 20 }}>
  <Text style={styles.sectionTitle}>Borrowed Books</Text>
  {borrowHistory.length > 0 ? (
    <FlatList
      data={borrowHistory}
      renderItem={renderBookItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 10 }}
      ListEmptyComponent={<Text> No books yet... Go borrow!</Text>}
    />
  ) : (
    <View style={{ padding: 10 }}>
      <Text style={{ color: '#999' }}>No borrowed books yet.</Text>
    </View>
  )}
</View>

{/* Favorite Books */}
<View>
  <Text style={styles.sectionTitle}>Favorite Books</Text>
  {favoriteBooksList.length > 0 ? (
    <FlatList
      data={favoriteBooksList}
      renderItem={renderBookItem}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  ) : (
    <View style={{ padding: 10 }}>
      <Text style={{ color: '#999' }}>No favorite books yet.</Text>
    </View>
  )}
</View>
    </SafeAreaView>
  );
};

