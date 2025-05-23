import React, { useState, useContext, useMemo, useCallback } from "react";
import { FlatList, View, Text, TouchableOpacity, useWindowDimensions, Alert, SafeAreaView } from "react-native";
import { BorrowingLog, Context } from "../../../props and context/context";
import { styles } from "../../../styles/Stylesheet";
import dayjs from "dayjs";
dayjs.extend(isBetween);
import isBetween from "dayjs/plugin/isBetween";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "../../../props and context/navprops";
import { date } from "yup";

export default function LogsScreen() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const navigation = useNavigation<NavigationProp>();

  const { logs, deleteLogs, currentAccount, setLogs, setCurrentLog, setCurrentAccount } = useContext(Context);

  // States
  const [filterType, setFilterType] = useState<"all" | "requested" | "checkedOut" | "returned">("all");
  const [filterOrder, setFilterOrder] = useState<"asc" | "desc">("desc");
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month').toDate());
  const [endDate, setEndDate] = useState(dayjs().toDate());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Derived values
  const isAdmin = useMemo(() => currentAccount?.slice(0, 2) === "AD", [currentAccount]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    // Apply filter type
    switch (filterType) {
      case "requested":
        result = result.filter((item) => !item.dateLent && !item.dateReturned);
        break;
      case "checkedOut":
        result = result.filter((item) => item.dateLent && !item.dateReturned);
        break;
      case "returned":
        result = result.filter((item) => item.dateReturned);
        break;
      default:
        break;

    }

      

    // Apply date range
    const start = dayjs(startDate).startOf("day");
    const end = dayjs(endDate).endOf("day");

    result = result.filter((log) => {
      const logDate = dayjs(log.dateRequested || log.dateLent || log.dateReturned);
      return logDate.isBetween(start, end, null, "[]"); // inclusive
    });

    // Sort
    result.sort((a, b) => {
      const aId = parseInt(a.id);
      const bId = parseInt(b.id);
      return filterOrder === "asc" ? aId - bId : bId - aId;
    });

    console.log(result);
    return result;
  }, [logs, filterType, startDate, endDate, filterOrder]);

  // Handlers
  const handleSetFilterType = useCallback(
    (type: "all" | "requested" | "checkedOut" | "returned") => {
      setFilterType(type);
    },
    []
  );

  const handleConfirmStartDate = useCallback((date: Date) => {
    setStartDate(date);
    setShowStartDatePicker(false);
  }, []);

  const handleConfirmEndDate = useCallback((date: Date) => {
    setEndDate(date);
    setShowEndDatePicker(false);
  }, []);

  const clearDates = useCallback(() => {
    setStartDate(dayjs().subtract(1, 'month').toDate());
    setEndDate(dayjs().toDate());
  }, []);

  const handleRequest = (logId: string) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId && !log.dateLent
          ? { ...log, dateLent: dayjs().toISOString() }
          : log
      )
    );
  };
  const handleReturn = (logId: string) => {
    setLogs((prevLogs) =>
      prevLogs.map((log) =>
        log.id === logId && log.dateLent && !log.dateReturned
          ? { ...log, dateReturned: dayjs().toISOString() }
          : log
      )
    );
  };

  const handleEdit = (id: string) => {
    setCurrentLog(id);
    navigation.navigate('AddLog')
  }

  const handleDelete = (index: string[]) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {

          deleteLogs(index);
        },
      },
    ]);
  };

  //LOGOUT
  const handleLogout = () => {
    navigation.replace('Login');
    setCurrentAccount("");
  };

  const { } = useContext(Context);
  return (
    <SafeAreaView style={[styles.container, { paddingRight: 20, paddingLeft: isLandscape ? 60 : 20 }]}>
{/* Logout Button - Top Right */}
     { !isAdmin && <View style={{
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.title}>Borrowing Logs</Text>
        {isAdmin && <TouchableOpacity
          onPress={() => { setCurrentLog(""); navigation.navigate('AddLog') }}
          style={[styles.buttonContainer, { marginRight: 20, alignSelf: 'center' }]}
        >
          <Text style={styles.buttonText}>Add New Log</Text>
        </TouchableOpacity>
        }
      </View>

      <View style={styles.filterBar}>
        {/* All */}
        <TouchableOpacity
          onPress={() => handleSetFilterType('all')}
          style={[
            styles.filterButton,
            filterType === 'all' && styles.filterButtonActive,
          ]}
        >
          <Text style={[
            styles.filterButtonText,
            filterType === 'all' && styles.filterButtonTextActive,
          ]}>All</Text>
        </TouchableOpacity>

        {/* Requested */}
        <TouchableOpacity
          onPress={() => handleSetFilterType('requested')}
          style={[
            styles.filterButton,
            filterType === 'requested' && styles.filterButtonActive,
          ]}
        >
          <Text style={[
            styles.filterButtonText,
            filterType === 'requested' && styles.filterButtonTextActive,
          ]}>Requested</Text>
        </TouchableOpacity>

        {/* Checked-Out */}
        <TouchableOpacity
          onPress={() => handleSetFilterType('checkedOut')}
          style={[
            styles.filterButton,
            filterType === 'checkedOut' && styles.filterButtonActive,
          ]}
        >
          <Text style={[
            styles.filterButtonText,
            filterType === 'checkedOut' && styles.filterButtonTextActive,
          ]}>Checked-Out</Text>
        </TouchableOpacity>

        {/* Returned */}
        <TouchableOpacity
          onPress={() => handleSetFilterType('returned')}
          style={[
            styles.filterButton,
            filterType === 'returned' && styles.filterButtonActive,
          ]}
        >
          <Text style={[
            styles.filterButtonText,
            filterType === 'returned' && styles.filterButtonTextActive,
          ]}>Returned</Text>
        </TouchableOpacity>

        {/* Sort Order */}
        <TouchableOpacity
          onPress={() => setFilterOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          style={styles.sortButton}
        >
          <Text style={styles.filterButtonText}>
            {filterOrder === 'asc' ? 'A→Z' : 'Z→A'}
          </Text>
        </TouchableOpacity>

        {/* Start Date */}
        <TouchableOpacity
          onPress={() => setShowStartDatePicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.filterButtonText}>
            From: {dayjs(startDate).format('YYYY-MM-DD')}
          </Text>
        </TouchableOpacity>

        {/* End Date */}
        <TouchableOpacity
          onPress={() => setShowEndDatePicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.filterButtonText}>
            To: {dayjs(endDate).format('YYYY-MM-DD')}
          </Text>
        </TouchableOpacity>
      </View>


      {/* Table Header */}
      <View style={[styles.table_header]}>
        <Text numberOfLines={1} style={[styles.heading]}>ID</Text>
        <Text numberOfLines={1} style={[styles.heading]}>User</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Book</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Date Requested</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Date Lent</Text>
        <Text numberOfLines={1} style={[styles.heading]}>Date Returned</Text>
        {isAdmin && <Text style={[styles.heading]}></Text>}
        {isAdmin && <Text style={[styles.heading]}></Text>}
      </View>

      {/* Logs List */}
      <FlatList
        style={{ flex: 1 }}
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        extraData={logs}
        ListEmptyComponent={<Text numberOfLines={1} style={{ textAlign: "center", padding: 20 }}>No Logs Match...</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.cell}>{item.id}</Text>
            <Text numberOfLines={1} style={styles.cell}>{item.userid}</Text>
            <Text numberOfLines={1} style={styles.cell}>{item.bookid}</Text>
            <Text numberOfLines={1} style={styles.cell}>{item.dateRequested || ''}</Text>

            <TouchableOpacity style={styles.cell} onPress={() => handleRequest(item.id)} disabled={item.dateLent ? true : false} >
              <Text style={{ color: !item.dateLent ? "#CA7E53" : "#000" }} numberOfLines={1}>{item.dateLent || item.dateRequested && 'Lend'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cell} onPress={() => handleReturn(item.id)} disabled={!item.dateRequested ? true : false}>
              <Text style={{ color: !item.dateReturned ? "#CA7E53" : "#000" }} numberOfLines={1}>{item.dateLent && !item.dateReturned ? 'Return' : item.dateReturned}</Text>
            </TouchableOpacity>

            {isAdmin &&
              <TouchableOpacity style={styles.cell} onPress={() => handleEdit(item.id)}>
                <Text style={styles.view} numberOfLines={1}>'Edit' </Text>
              </TouchableOpacity>
            }
            {isAdmin &&
              <TouchableOpacity style={[styles.cell]} onPress={() => handleDelete([item.id])}>
                <Text style={styles.delete} numberOfLines={1}>'Delete'</Text>
              </TouchableOpacity>
            }
          </View>
        )}
      />

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
