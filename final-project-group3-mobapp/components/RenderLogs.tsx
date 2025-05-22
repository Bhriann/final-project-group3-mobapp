import React, { useState, useContext, useMemo, useCallback } from "react";
import {FlatList,View,Text,TouchableOpacity,} from "react-native";
import { Context } from "../props and context/context";
import { styles } from "../styles/Stylesheet";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import EllipsisText from "./EllipsisText";
import DateTimePickerModal from "react-native-modal-datetime-picker";

dayjs.extend(isBetween);

export const RenderLogs = () => {
  const { logs, deleteLogs, currentAccount } = useContext(Context);

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

  return (
    <View style={{ flex: 1 }}>
      {/* Buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
        <TouchableOpacity onPress={() => handleSetFilterType("all")}>
          <EllipsisText style={{ paddingHorizontal: 10 }}>All</EllipsisText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSetFilterType("requested")}>
          <EllipsisText style={{ paddingHorizontal: 10 }}>Requested</EllipsisText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSetFilterType("checkedOut")}>
          <EllipsisText style={{ paddingHorizontal: 10 }}>Checked-Out</EllipsisText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSetFilterType("returned")}>
          <EllipsisText style={{ paddingHorizontal: 10 }}>Returned</EllipsisText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterOrder(filterOrder === "asc" ? "desc" : "asc")}>
          <EllipsisText style={{ paddingHorizontal: 10 }}>
            Order: {filterOrder === "asc" ? "ASC" : "DESC"}
          </EllipsisText>
        </TouchableOpacity>

        {/* Date Pickers */}
        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <EllipsisText style={{ paddingHorizontal: 10 }}>
            From: {dayjs(startDate).format("YYYY-MM-DD")}
          </EllipsisText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
          <EllipsisText style={{ paddingHorizontal: 10 }}>
            To: {dayjs(endDate).format("YYYY-MM-DD")}
          </EllipsisText>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearDates}>
          <EllipsisText style={{ paddingHorizontal: 10, color: 'red' }}>Reset</EllipsisText>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={[styles.table_header]}>
        <EllipsisText style={[styles.heading]}>ID</EllipsisText>
        <EllipsisText style={[styles.heading]}>User</EllipsisText>
        <EllipsisText style={[styles.heading]}>Book</EllipsisText>
        <EllipsisText style={[styles.heading]}>Date Requested</EllipsisText>
        <EllipsisText style={[styles.heading]}>Date Lent</EllipsisText>
        <EllipsisText style={[styles.heading]}>Date Returned</EllipsisText>
        <EllipsisText style={[styles.heading]}>{isAdmin ? "Edit" : ""}</EllipsisText>
        <EllipsisText style={[styles.heading]}>{isAdmin ? "Delete" : ""}</EllipsisText>
      </View>

      {/* Logs List */}
      <FlatList
        style={{ flex: 1 }}
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EllipsisText style={{ textAlign: "center", padding: 20 }}>No Logs Match...</EllipsisText>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <EllipsisText style={styles.cell}>{item.id}</EllipsisText>
            <EllipsisText style={styles.cell}>{item.userid}</EllipsisText>
            <EllipsisText style={styles.cell}>{item.bookid}</EllipsisText>
            <EllipsisText style={styles.cell}>{item.dateRequested || ''}</EllipsisText>
            <EllipsisText style={styles.cell}>{item.dateLent || ''}</EllipsisText>
            <EllipsisText style={styles.cell}>{item.dateReturned || ''}</EllipsisText>
            <EllipsisText style={styles.cell}>{isAdmin ? 'Edit' : ''}</EllipsisText>
            <TouchableOpacity onPress={() => deleteLogs([item.id])}>
              <EllipsisText style={styles.cell}>{isAdmin ? 'Delete' : ''}</EllipsisText>
            </TouchableOpacity>
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
    </View>
  );
};