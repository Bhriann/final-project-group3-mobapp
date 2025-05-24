import React, { useContext, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Alert,
  useWindowDimensions,
} from 'react-native';

// Context & Navigation
import { Context } from '../../../props and context/context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../../props and context/navprops';
import { Accounts } from '../../../props and context/context';
// Styles & Icons
import { styles } from '../../../styles/Stylesheet';
import { Ionicons } from '@expo/vector-icons';

export default function AccountsScreen() {
  const { width } = useWindowDimensions();
  const isLandscape = width > 600;

  const navigation = useNavigation<NavigationProp>();
  const { users, librarians, setUsers, setLibrarians, setTargetAccount } = useContext(Context);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchText, setSearchText] = useState('');
  const [roleFilter, setRoleFilter] = useState<'US' | 'LB' | null>('US');

  const filteredAndSortedAccounts = useMemo(() => {
    let filtered: Accounts[] = [];

    if (roleFilter === 'US') {
      filtered = users;
    } else if (roleFilter === 'LB') {
      filtered = librarians;
    } else {
      filtered = [...users, ...librarians];
    }

    // Search filter logic
    const results = filtered.filter((account) =>
      ['id', 'username', 'email'].some((key) =>
        String(account[key] || '').toLowerCase().includes(searchText.toLowerCase())
      )
    );

    // Sort by numeric ID after prefix
    return results.sort((a, b) => {
      const idA = parseInt(a.id.slice(2)) || 0;
      const idB = parseInt(b.id.slice(2)) || 0;

      return sortOrder === 'asc' ? idA - idB : idB - idA;
    });
  }, [users, librarians, roleFilter, searchText, sortOrder]);
  // 💥 Handle delete properly by checking role
  const handleDelete = (accountId: string, role: 'US' | 'LB') => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          if (role === 'US') {
            setUsers(users.filter(u => u.id !== accountId));
          } else {
            setLibrarians(librarians.filter(l => l.id !== accountId));
          }
        },
      },
    ]);
  };

  // Navigate to edit screen
  const handleOnEdit = (accountId: string, role: 'US' | 'LB') => {
    setTargetAccount(accountId)
    navigation.navigate('AddAccount');
  };

  return (
    <SafeAreaView style={[styles.container, { paddingRight: 20, paddingLeft: isLandscape ? 60 : 20 }]}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>Library Accounts</Text>

        {/* Sort Toggle */}
        <TouchableOpacity
          onPress={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          style={{
            backgroundColor: '#f0f0f0',
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 20,
            marginLeft: 8,
          }}
        >
          <Text>{sortOrder === 'asc' ? 'ID ↑' : 'ID ↓'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
        <TouchableOpacity
          style={{
            padding: 8,
            backgroundColor: roleFilter === 'US' ? '#007AFF' : '#f0f0f0',
            borderRadius: 20,
            marginHorizontal: 5,
          }}
          onPress={() => setRoleFilter('US')}
        >
          <Text style={{ color: roleFilter === 'US' ? 'white' : 'black' }}>Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 8,
            backgroundColor: roleFilter === 'LB' ? '#007AFF' : '#f0f0f0',
            borderRadius: 20,
            marginHorizontal: 5,
          }}
          onPress={() => setRoleFilter('LB')}
        >
          <Text style={{ color: roleFilter === 'LB' ? 'white' : 'black' }}>Librarians</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            padding: 8,
            backgroundColor: roleFilter === null ? '#007AFF' : '#f0f0f0',
            borderRadius: 20,
            marginHorizontal: 5,
          }}
          onPress={() => setRoleFilter(null)}
        >
          <Text style={{ color: roleFilter === null ? 'white' : 'black' }}>All</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#f5f5f5',
          borderRadius: 8,
          paddingHorizontal: 10,
          alignItems: 'center'
        }}>
          <TextInput
            placeholder="Search by ID, Name, Email"
            value={searchText}
            onChangeText={setSearchText}
            style={{
              flex: 1,
              fontSize: 14,
              paddingVertical: 6,
            }}
          />
          <Ionicons name="search" size={20} color="#888" />
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.table_header}>
        <Text numberOfLines={1} style={styles.heading}>ID</Text>
        <Text numberOfLines={1} style={styles.heading}>Name</Text>
        <Text numberOfLines={1} style={styles.heading}>Email</Text>
        <Text numberOfLines={1} style={styles.heading}></Text>
        <Text numberOfLines={1} style={styles.heading}></Text>
      </View>

      {/* Account List */}
      <FlatList
        data={filteredAndSortedAccounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const role = item.id.startsWith('US') ? 'US' : 'LB';
          return (
            <View style={styles.row}>
              <Text numberOfLines={1} style={styles.cell}>{item.id}</Text>
              <Text numberOfLines={1} style={styles.cell}>{item.username}</Text>
              <Text numberOfLines={1} style={styles.cell}>{item.email}</Text>

              {/* Edit Button */}
              <TouchableOpacity
                style={styles.cell}
                onPress={() => handleOnEdit(item.id, role)}
              >
                <Text>Edit</Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.cell}
                onPress={() => handleDelete(item.id, role)}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollLib}
      />
    </SafeAreaView>
  );
}