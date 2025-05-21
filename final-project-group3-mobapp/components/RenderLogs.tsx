import React, { useState, useContext, useEffect } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { Context } from "../props and context/context";
import { styles } from "../styles/Stylesheet";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween"
dayjs.extend(isBetween)

import DateTimePickerModal from "react-native-modal-datetime-picker";

export const RenderLogs = () => {
    const { logs, isAdmin, deleteLogs } = useContext(Context);
    const [filteredLogs, setFilteredLogs] = useState(logs);
    const [filterOrder, setFilterOrder] = useState(false); // false = DESC, true = ASC

    const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month').toDate());
    const [endDate, setEndDate] = useState(dayjs().toDate());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Filter types
    const filterAll = () => setFilteredLogs(logs);
    const filterRequested = () =>
        setFilteredLogs(
            logs.filter((item) => !item.dateLent && !item.dateReturned)
        );
    const filterCheckedOut = () =>
        setFilteredLogs(
            logs.filter((item) => item.dateLent && !item.dateReturned)
        );
    const filterReturned = () =>
        setFilteredLogs(
            logs.filter((item) => item.dateReturned)
        );

    // Sort based on ID
    useEffect(() => {
        const sorted = [...filteredLogs];
        if (!filterOrder)
            sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        else
            sorted.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        setFilteredLogs(sorted);
    }, [filterOrder, filteredLogs.length]);

    // Apply date filter
    useEffect(() => {
        if (!startDate || !endDate) return;

        const start = dayjs(startDate).startOf("day");
        const end = dayjs(endDate).endOf("day");

        const filtered = logs.filter((log) => {
            const logDate = dayjs(log.dateRequested || log.dateLent || log.dateReturned);
            return logDate.isBetween(start, end, null, "[]"); // inclusive
        });

        setFilteredLogs(filtered);
    }, [startDate, endDate]);

    useEffect(() => {
        setFilteredLogs(logs);
    }, [logs]);
    // Handlers for date picker
    const handleConfirmStartDate = (date: Date) => {
        setStartDate(date);
        setShowStartDatePicker(false);
    };

    const handleConfirmEndDate = (date: Date) => {
        setEndDate(date);
        setShowEndDatePicker(false);
    };

    const clearDates = () => {
        setStartDate(dayjs().subtract(1, 'month').toDate());
        setEndDate(dayjs().toDate());
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Buttons */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
                <TouchableOpacity onPress={filterAll}>
                    <Text style={{ paddingHorizontal: 10 }}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={filterRequested}>
                    <Text style={{ paddingHorizontal: 10 }}>Requested</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={filterCheckedOut}>
                    <Text style={{ paddingHorizontal: 10 }}>Checked-Out</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={filterReturned}>
                    <Text style={{ paddingHorizontal: 10 }}>Returned</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterOrder(!filterOrder)}>
                    <Text style={{ paddingHorizontal: 10 }}>{filterOrder ? "DESC" : "ASC"}</Text>
                </TouchableOpacity>

                {/* Start Date Button */}
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                    <Text style={{ paddingHorizontal: 10 }}>
                        From: {dayjs(startDate).format("YYYY-MM-DD")}
                    </Text>
                </TouchableOpacity>

                {/* End Date Button */}
                <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                    <Text style={{ paddingHorizontal: 10 }}>
                        To: {dayjs(endDate).format("YYYY-MM-DD")}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={clearDates}>
                    <Text style={{ paddingHorizontal: 10, color: 'red' }}>Reset</Text>
                </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View style={[styles.table_header]}>
                <Text style={[styles.heading]}>ID</Text>
                <Text style={[styles.heading]}>User</Text>
                <Text style={[styles.heading]}>Book</Text>
                <Text style={[styles.heading]}>Date Requested</Text>
                <Text style={[styles.heading]}>Date Lent</Text>
                <Text style={[styles.heading]}>Date Returned</Text>
                <Text style={[styles.heading]}>{isAdmin ? "Edit" : ""}</Text>
                <Text style={[styles.heading]}>{isAdmin ? "Delete" : ""}</Text>
            </View>

            {/* Logs List */}
            <FlatList
                style={{ flex: 1 }}
                data={filteredLogs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.id}</Text>
                        <Text style={styles.cell}>{item.userid}</Text>
                        <Text style={styles.cell}>{item.bookid}</Text>
                        <Text style={styles.cell}>{item.dateRequested || ''}</Text>
                        <Text style={styles.cell}>{item.dateLent || ''}</Text>
                        <Text style={styles.cell}>{item.dateReturned || ''}</Text>
                        <Text style={styles.cell}>{isAdmin ? 'Edit' : ''}</Text>
                        <TouchableOpacity onPress={() => deleteLogs([item.id])}>
                            <Text style={styles.cell}>{isAdmin ? 'Delete' : ''}</Text>
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