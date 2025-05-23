import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions,
  SafeAreaView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Context
import { Context } from '../../../props and context/context';
import { BorrowingLog } from '../../../props and context/context';

// Navigation
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../../../props and context/navprops';

import dayjs from 'dayjs';

// Styles
import { styles } from '../../../styles/Stylesheet';

const inputStyle = {
  borderBottomWidth: 1,
  marginVertical: 8,
  paddingVertical: 4,
  fontSize: 16,
};

export default function AddLogScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const navigation = useNavigation<NavigationProp>();
  const {
    logs,
    currentLog,
    setLogs,
    setCurrentLog
  } = useContext(Context);

  const [isEditing, setIsEditing] = useState(false);
  const [targetLog, setTargetLog] = useState<BorrowingLog | null>(null);

  // Load existing log when editing
  useEffect(() => {
    if (currentLog && logs.length > 0) {
      const existingLog = logs.find((log) => log.id === currentLog) || null;
      setTargetLog(existingLog);
      setIsEditing(!!existingLog);
    }
  }, [currentLog, logs]);

  // Generate new ID safely
  const generateNewId = () => {
    const ids = logs.map((log) => parseInt(log.id)).filter((id) => !isNaN(id));
    const maxId = ids.length ? Math.max(...ids) : 0;
    return (maxId + 1).toString();
  };

  // Unified validation schema for logs
  const LogSchema = Yup.object().shape({
    id: Yup.string()
      .required('ID is required')
      .test('unique-id', 'This ID already exists', function (value) {
        if (!value) return true;

        // Allow editing the same log
        if (isEditing && targetLog?.id === value) return true;

        // Block if another log has that ID
        return !logs.some((log) => log.id === value);
      }),
    userid: Yup.string().required('User ID is required'),
    bookid: Yup.string().required('Book ID is required'),
    dateRequested: Yup.string().required('Request date is required'),
    dateLent: Yup.string().optional(),
    dateReturned: Yup.string().optional(),
  });

  // Reset form values when `currentLog` changes
  const initialValues = {
    id: targetLog?.id || generateNewId(),
    userid: targetLog?.userid || '',
    bookid: targetLog?.bookid || '',
    dateRequested: targetLog?.dateRequested || dayjs().format('YYYY-MM-DDTHH:mm:ssZ'),
    dateLent: targetLog?.dateLent || undefined,
    dateReturned: targetLog?.dateReturned || undefined,
  };

  const onSubmit = (values: BorrowingLog) => {
    const baseData = {
      ...values,
    };

    if (isEditing && targetLog) {
      setLogs((prevLogs) =>
        prevLogs.map((log) =>
          log.id === targetLog.id ? { ...log, ...baseData } : log
        )
      );
      Alert.alert('Log Updated', 'The borrowing log has been updated');
    } else {
      setLogs((prevLogs) => [...prevLogs, baseData]);
      Alert.alert('New Log Added', 'A new borrowing log has been created');
    }

    setCurrentLog("");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { paddingRight: 20, paddingLeft: isLandscape ? 60 : 20 }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
            {/* Formik Form */}
            <Formik
              initialValues={initialValues}
              validationSchema={LogSchema}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={{ width: '100%' }}>
                  {/* Log ID */}
                  <Text style={styles.labelStyle}>Log ID</Text>
                  <TextInput
                    placeholder="Enter Log ID"
                    value={values.id}
                    onChangeText={handleChange('id')}
                    onBlur={handleBlur('id')}
                    style={inputStyle}
                  />
                  {touched.id && errors.id && (
                    <Text style={styles.errorStyle}>{errors.id}</Text>
                  )}

                  {/* User ID */}
                  <Text style={styles.labelStyle}>User ID</Text>
                  <TextInput
                    placeholder="Enter User ID"
                    value={values.userid}
                    onChangeText={handleChange('userid')}
                    onBlur={handleBlur('userid')}
                    style={inputStyle}
                  />
                  {touched.userid && errors.userid && (
                    <Text style={styles.errorStyle}>{errors.userid}</Text>
                  )}

                  {/* Book ID */}
                  <Text style={styles.labelStyle}>Book ID</Text>
                  <TextInput
                    placeholder="Enter Book ID"
                    value={values.bookid}
                    onChangeText={handleChange('bookid')}
                    onBlur={handleBlur('bookid')}
                    style={inputStyle}
                  />
                  {touched.bookid && errors.bookid && (
                    <Text style={styles.errorStyle}>{errors.bookid}</Text>
                  )}

                  {/* Date Requested */}
                  <Text style={styles.labelStyle}>Date Requested</Text>
                  <TextInput
                    placeholder="YYYY-MM-DDTHH:mm:ssZ"
                    value={values.dateRequested}
                    onChangeText={handleChange('dateRequested')}
                    onBlur={handleBlur('dateRequested')}
                    keyboardType="default"
                    style={inputStyle}
                  />
                  {touched.dateRequested && errors.dateRequested && (
                    <Text style={styles.errorStyle}>{errors.dateRequested}</Text>
                  )}

                  {/* Date Lent */}
                  <Text style={styles.labelStyle}>Date Lent</Text>
                  <TextInput
                    placeholder="YYYY-MM-DDTHH:mm:ssZ (leave empty if not lent)"
                    value={values.dateLent ?? ''}
                    onChangeText={handleChange('dateLent')}
                    onBlur={handleBlur('dateLent')}
                    style={inputStyle}
                  />

                  {/* Date Returned */}
                  <Text style={styles.labelStyle}>Date Returned</Text>
                  <TextInput
                    placeholder="YYYY-MM-DDTHH:mm:ssZ (leave empty if not returned)"
                    value={values.dateReturned ?? ''}
                    onChangeText={handleChange('dateReturned')}
                    onBlur={handleBlur('dateReturned')}
                    style={inputStyle}
                  />

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={styles.buttonContainer}

                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                      {isEditing ? 'Update Log' : 'Create Log'}
                    </Text>
                  </TouchableOpacity>

                  {/* Cancel Button */}
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                      marginTop: 12,
                      padding: 14,
                      backgroundColor: '#dc3545',
                      borderRadius: 8,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}