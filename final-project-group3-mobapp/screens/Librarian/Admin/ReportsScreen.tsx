import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  PermissionsAndroid, // added import
  Platform,          // added import
} from 'react-native';
import { styles } from '../../../styles/Stylesheet';
import { Context } from '../../../props and context/context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/locale/en';

// Navigation
import { NavigationProp } from '../../../props and context/navprops';
import { useNavigation } from '@react-navigation/native';

// PDF generator
import RNHTMLtoPDF from 'react-native-html-to-pdf';

dayjs.locale('en');
dayjs.extend(isBetween);

export default function ReportsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { books, logs } = useContext(Context);

  // Filtered logs state
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

  // Date picker confirm handlers
  const handleConfirmStartDate = (date: Date) => {
    setStartDate(new Date(date)); 
    setShowStartDatePicker(false);
  };

  const handleConfirmEndDate = (date: Date) => {
    setEndDate(new Date(date)); 
    setShowEndDatePicker(false);
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

  // Update statistics
  useEffect(() => {
    setTotalBooks(books.length);

    const borrowed = filteredLogs.filter(item => item.dateLent && !item.dateReturned).length;
    const returned = filteredLogs.filter(item => item.dateReturned).length;

    setBorrowedBooks(borrowed);
    setReturnedBooks(returned);

    const addedInPeriod = books.filter((book) =>
      dayjs(book.acqDate).isBetween(startDate, endDate, null, '[]')
    ).length;
    setBooksAdded(addedInPeriod);
  }, [filteredLogs, books, startDate, endDate]);

  // Quick date filter presets
  const setQuickRange = (range: 'week' | 'month' | 'year' | 'all') => {
    const now = dayjs();
    switch (range) {
      case 'week':
        setStartDate(now.subtract(1, 'week').toDate());
        setEndDate(now.toDate());
        break;
      case 'month':
        setStartDate(now.subtract(1, 'month').toDate());
        setEndDate(now.toDate());
        break;
      case 'year':
        setStartDate(now.subtract(1, 'year').toDate());
        setEndDate(now.toDate());
        break;
      case 'all':
        setStartDate(new Date(2000, 0, 1));
        setEndDate(now.toDate());
        break;
    }
  };

  // **ADDED**: Request storage permission on Android
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to save PDFs',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission request error:', err);
        return false;
      }
    }
    return true; // iOS doesn't require permission
  };

  // Generate PDF function
  const generatePDF = async () => {
    // **ADDED**: Check permission first
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Cannot generate PDF without storage permission.');
      return;
    }

    const fromDate = dayjs(startDate).format('YYYY-MM-DD');
    const toDate = dayjs(endDate).format('YYYY-MM-DD');

    const htmlContent = `
      <h1 style="text-align:center;">Library Report</h1>
      <p><strong>Date Range:</strong> ${fromDate} to ${toDate}</p>
      <p><strong>Total Books:</strong> ${totalBooks}</p>
      <p><strong>Borrowed:</strong> ${borrowedBooks}</p>
      <p><strong>Returned:</strong> ${returnedBooks}</p>
      <p><strong>Books Added:</strong> ${booksAdded}</p>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: `Library_Report_${fromDate}_to_${toDate}`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      Alert.alert('PDF Generated', `PDF saved to:\n${file.filePath}`);
    } catch (error) {
      // **ADDED**: Log detailed error for debugging
      console.error('PDF generation error:', error);
      Alert.alert('PDF Error', 'Something went wrong while generating the PDF.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
      </View>

      <ScrollView contentContainerStyle={styles.reportContainer}>
        {/* Quick Filter Header Row */}
        <View style={styles.quickFiltersRow}>
          <TouchableOpacity onPress={() => setQuickRange('week')} style={styles.quickFilterButton}>
            <Text style={styles.quickFilterText}>Past Week</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setQuickRange('month')} style={styles.quickFilterButton}>
            <Text style={styles.quickFilterText}>Past Month</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setQuickRange('year')} style={styles.quickFilterButton}>
            <Text style={styles.quickFilterText}>Past Year</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setQuickRange('all')} style={styles.quickFilterButton}>
            <Text style={styles.quickFilterText}>All Time</Text>
          </TouchableOpacity>
        </View>

        {/* Date Range Picker Buttons */}
        <View style={styles.dateRangeContainer}>
          <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
            <Text style={styles.dateText}>From: {dayjs(startDate).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text style={styles.dateText}>To: {dayjs(endDate).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Total Books: {totalBooks}</Text>
          <Text style={styles.statsText}>Borrowed: {borrowedBooks}</Text>
          <Text style={styles.statsText}>Returned: {returnedBooks}</Text>
          <Text style={styles.statsText}>Books Added: {booksAdded}</Text>
        </View>

        {/* Generate PDF Button */}
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <TouchableOpacity onPress={generatePDF} style={styles.quickFilterButton}>
            <Text style={styles.quickFilterText}>Generate PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Start Date Picker */}
      <DateTimePickerModal
        isVisible={showStartDatePicker}
        mode="date"
        onConfirm={handleConfirmStartDate}
        onCancel={() => setShowStartDatePicker(false)}
        maximumDate={endDate || dayjs().toDate()}
      />

      {/* End Date Picker */}
      <DateTimePickerModal
        isVisible={showEndDatePicker}
        mode="date"
        onConfirm={handleConfirmEndDate}
        onCancel={() => setShowEndDatePicker(false)}
        minimumDate={startDate}
        maximumDate={dayjs().toDate()}
      />
    </SafeAreaView>
  );
}
