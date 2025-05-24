import React, { useState, useContext, useEffect, useMemo } from 'react';
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
  const { books, logs, setCurrentAccount, currentAccount} = useContext(Context);
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

  const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'LibriApp needs access to save PDF reports.',
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
  return true; // iOS doesn't need explicit permission
};


  // Generate PDF function
  const generatePDF = async () => {
  const hasPermission = await requestStoragePermission();
  if (!hasPermission && Platform.OS === 'android') {
    Alert.alert('Permission Required', 'Storage access is required to generate PDF');
    return;
  }

  const fromDate = dayjs(startDate).format('YYYY-MM-DD');
  const toDate = dayjs(endDate).format('YYYY-MM-DD');

  const htmlContent = `
    <html>
      <head><meta charset="UTF-8" /></head>
      <body style="padding:40px;">
        <h1 style="text-align:center;">Library Report</h1>
        <p><strong>Date Range:</strong> ${fromDate} to ${toDate}</p>
        <hr />
        <h3>Statistics</h3>
        <ul>
          <li><strong>Total Books:</strong> ${totalBooks}</li>
          <li><strong>Borrowed:</strong> ${borrowedBooks}</li>
          <li><strong>Returned:</strong> ${returnedBooks}</li>
          <li><strong>Books Added:</strong> ${booksAdded}</li>
        </ul>
        <p style="font-size:12px; color:#666; margin-top:50px;">Generated by LibriApp • ${dayjs().format('YYYY-MM-DD HH:mm:ss')}</p>
      </body>
    </html>
  `;

  try {
    const options = {
      html: htmlContent,
      fileName: `Report_${fromDate}_to_${toDate}`,
      directory: 'Documents',
      base64: false,
    };

    const file = await RNHTMLtoPDF.convert(options);
    console.log('PDF File Path:', file.filePath);

      // Inside try block after generating file
    Alert.alert('PDF Generated!', `Saved at:\n${file.filePath}`);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    Alert.alert('Error', 'Failed to generate PDF.');
  }



};

 
 const isAdmin = useMemo(() => currentAccount?.slice(0, 2) === "AD", [currentAccount]);
  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reports</Text>
         {isAdmin && <View style={{
                     position: 'absolute',
                     top: 20,
                     right: 20,
                     zIndex: 10,
                   }}>
                     <TouchableOpacity onPress={()=> handleLogout()} style={{
                       backgroundColor: '#AC0306',
                       paddingVertical: 6,
                       paddingHorizontal: 12,
                       borderRadius: 5,
                     }}>
                       <Text style={{ color: 'white', fontFamily: 'Grotesk_Medium'}}>Logout</Text>
                     </TouchableOpacity>
                   </View>
             
                   }
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
          <TouchableOpacity onPress={() => generatePDF()} style={styles.quickFilterButton}>
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
