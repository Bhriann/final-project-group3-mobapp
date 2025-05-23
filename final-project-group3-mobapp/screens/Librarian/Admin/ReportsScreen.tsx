import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from '../../../styles/Stylesheet';
import { Context } from '../../../props and context/context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/en';

//Navigation
import { NavigationProp } from '../../../props and context/navprops';
import { useNavigation } from '@react-navigation/native';

dayjs.locale('en');
dayjs.extend(isBetween);

export default function ReportsScreen() {

  const navigation = useNavigation<NavigationProp>();
  const { books, logs, setCurrentAccount} = useContext(Context);

  // State for filtered data
  const [filteredLogs, setFilteredLogs] = useState(logs);

  // Stats state
  const [totalBooks, setTotalBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [returnedBooks, setReturnedBooks] = useState(0);
  const [booksAdded, setBooksAdded] = useState(0);

  // Date picker state
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month').toDate());
  const [endDate, setEndDate] = useState(dayjs().toDate());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Handle date selection
  const handleConfirmStartDate = (date: Date) => {
    setStartDate(date);
    setShowStartDatePicker(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    setEndDate(date);
    setShowEndDatePicker(false);
  };
  //LOGOUT
  const handleLogout = () => {
    navigation.replace('Login');
    setCurrentAccount("");
  };

  // Filter logs by date range
  useEffect(() => {
    if (!logs || !startDate || !endDate) return;

    const start = dayjs(startDate).startOf('day');
    const end = dayjs(endDate).endOf('day');

    const filtered = logs.filter((log) => {
      const dateRequested = log.dateRequested ? dayjs(log.dateRequested) : null;
      const dateLent = log.dateLent ? dayjs(log.dateLent) : null;
      const dateReturned = log.dateReturned ? dayjs(log.dateReturned) : null;

      const logDate = dateRequested || dateLent || dateReturned;

      return logDate?.isBetween(start, end, null, '[]'); // inclusive
    });

    setFilteredLogs(filtered);
  }, [logs, startDate, endDate]);

  // Update stats when filteredLogs or books change
  useEffect(() => {
    setTotalBooks(books.length);

    // Count borrowed and returned
    const borrowed = filteredLogs.filter(
      (item) => item.dateLent && !item.dateReturned
    ).length;
    const returned = filteredLogs.filter(
      (item) => item.dateReturned
    ).length;

    setBorrowedBooks(borrowed);
    setReturnedBooks(returned);

    // Example: count books added in date range (if you have a `dateAdded` field)
    const addedInPeriod = books.filter((book) =>
      dayjs(book.acqDate).isBetween(startDate, endDate, null, '[]')
    ).length;
    setBooksAdded(addedInPeriod);
  }, [filteredLogs, books]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.headerTitle}>REPORTS</Text>
        <TouchableOpacity
          onPress={() => { handleLogout }}
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



      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {/* Date Range Picker Buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <Text>From: {dayjs(startDate).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text>To: {dayjs(endDate).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{ marginTop: 20 }}>
          <Text>Total Books: {totalBooks}</Text>
          <Text>Borrowed: {borrowedBooks}</Text>
          <Text>Returned: {returnedBooks}</Text>
          <Text>Books Added: {booksAdded}</Text>
        </View>

        {/* Quick Range Filters */}
        <View style={{ marginTop: 30 }}>
          <Text>Quick Filters:</Text>
          <TouchableOpacity
            onPress={() =>
              setStartDate(dayjs().subtract(1, 'week').toDate())
            }
          >
            <Text>Past Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setStartDate(dayjs().subtract(1, 'month').toDate())
            }
          >
            <Text>Past Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setStartDate(dayjs().subtract(1, 'year').toDate())
            }
          >
            <Text>Past Year</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setStartDate(new Date(2000, 0, 1)) // Very early date
            }
          >
            <Text>All Time</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={showStartDatePicker}
        mode="date"
        onConfirm={handleConfirmStartDate}
        onCancel={() => setShowStartDatePicker(false)}
        maximumDate={endDate ? new Date(endDate) : dayjs().toDate()}
      />

      <DateTimePickerModal
        isVisible={showEndDatePicker}
        mode="date"
        onConfirm={handleConfirmEndDate}
        onCancel={() => setShowEndDatePicker(false)}
        minimumDate={startDate ? new Date(startDate) : undefined}
        maximumDate={dayjs().toDate()}
      />
    </SafeAreaView>
  );
};

