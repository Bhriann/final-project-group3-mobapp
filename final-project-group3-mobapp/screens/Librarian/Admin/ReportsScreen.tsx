import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, Text, View, TouchableOpacity, ScrollView } from 'react-native';
//import { FontAwesome } from '@expo/vector-icons';
import { styles } from '../../../styles/Stylesheet';
import { Context } from '../../../props and context/context';

const ReportsScreen: React.FC = () => {
  //add the parameters here coming from context.tsx
  const { books, logs } = useContext(Context);

  const [bookReps, setBookReps] = useState(books);
  const [logReps, setLogReps] = useState(logs);

  const [logRange, setLogRange] = useState(0);

  const [numBooks, setNumBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [returnedBooks, setReturnedBooks] = useState(0);
  const [addedBooks, setAddedBooks] = useState(0);

  const Borrowed = () => { setBorrowedBooks(logReps.filter((item) => (item.dateLent !== undefined && item.dateReturned === undefined)).length); }
  const Returned = () => { setReturnedBooks(logReps.filter((item) => (item.dateReturned !== undefined)).length); }
  const NumBooks = () => { bookReps.length; }
  const BooksAdded = () => {}
  useEffect(() => {
    setBookReps(bookReps);  //add Date
    setLogReps(logReps);  //add Date
    NumBooks
    Borrowed
    Returned
    BooksAdded
  }, [logRange]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}> ReportsScreen</Text>
      </View>
      <ScrollView style={styles.body}>
        <Text>Reports</Text>
        <Text>Total Books: {numBooks}</Text>
        <Text>Borrowed: {borrowedBooks}</Text>
        <Text>Returned: {returnedBooks}</Text>
        <Text>Books Added: {addedBooks} </Text>

        <TouchableOpacity onPress={() => setLogRange(0)}>  <Text>Past Week</Text>  </TouchableOpacity>
        <TouchableOpacity onPress={() => setLogRange(0)}>  <Text>Past Month</Text>  </TouchableOpacity>
        <TouchableOpacity onPress={() => setLogRange(0)}>  <Text>Past Year</Text>  </TouchableOpacity>
        <TouchableOpacity onPress={() => setLogRange(0)}>  <Text>All time</Text>  </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportsScreen;
