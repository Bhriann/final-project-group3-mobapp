import React, { useState, useContext, useEffect } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import { Context } from "../props and context/context";
import { styles } from "../styles/Stylesheet";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween"
dayjs.extend(isBetween)

import EllipsisText from "./EllipsisText";

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
                    <EllipsisText style={{ paddingHorizontal: 10 }}>All</EllipsisText>
                </TouchableOpacity>
                <TouchableOpacity onPress={filterRequested}>
                    <EllipsisText style={{ paddingHorizontal: 10 }}>Requested</EllipsisText>
                </TouchableOpacity>
                <TouchableOpacity onPress={filterCheckedOut}>
                    <EllipsisText style={{ paddingHorizontal: 10 }}>Checked-Out</EllipsisText>
                </TouchableOpacity>
                <TouchableOpacity onPress={filterReturned}>
                    <EllipsisText style={{ paddingHorizontal: 10 }}>Returned</EllipsisText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterOrder(!filterOrder)}>
                    <EllipsisText style={{ paddingHorizontal: 10 }}>{filterOrder ? "DESC" : "ASC"}</EllipsisText>
                </TouchableOpacity>

                {/* Start Date Button */}
                <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
                    <EllipsisText style={{ paddingHorizontal: 10 }}>
                        From: {dayjs(startDate).format("YYYY-MM-DD")}
                    </EllipsisText>
                </TouchableOpacity>

                {/* End Date Button */}
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
                ListEmptyComponent={<EllipsisText style={{justifyContent:"center"}}>No Logs that Apply...</EllipsisText>}
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