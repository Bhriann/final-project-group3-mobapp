import React, { useState, useContext, useEffect } from "react";
import { FlatList, View, Text, Image, TouchableOpacity } from "react-native";
import { Context } from "../props and context/context";
import { styles } from "../styles/Stylesheet";
export const RenderLogs = () => {
    const { logs, isAdmin, deleteLogs } = useContext(Context);
    const [filteredLogs, setFilteredLogs,] = useState(logs);
    const [filterOrder, setFilterOrder] = useState(false);  //false = DESC, true = ASC
    const filterAll = () => { setFilteredLogs(logs); }
    const filterRequested = () => { setFilteredLogs(logs.filter((item) => (item.dateLent === undefined && item.dateReturned === undefined))); }
    const filterCheckedOut = () => { setFilteredLogs(logs.filter((item) => (item.dateLent !== undefined && item.dateReturned === undefined))); }
    const filterReturned = () => { setFilteredLogs(logs.filter((item) => (item.dateReturned !== undefined))); }

    useEffect(() => {
        if (filterOrder === false)
            filteredLogs.sort((a, b) => parseInt(b.id) - parseInt(a.id))
        else
            filteredLogs.sort((a, b) => parseInt(a.id) - parseInt(b.id))
    }, [filterOrder]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={filterAll}> <Text style={[{ paddingHorizontal: 10 }]}>All</Text> </TouchableOpacity>
                <TouchableOpacity onPress={filterRequested}> <Text style={[{ paddingHorizontal: 10 }]}>Requested</Text> </TouchableOpacity>
                <TouchableOpacity onPress={filterCheckedOut}> <Text style={[{ paddingHorizontal: 10 }]}>Checked-Out</Text> </TouchableOpacity>
                <TouchableOpacity onPress={filterReturned}> <Text style={[{ paddingHorizontal: 10 }]}>Returned</Text> </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterOrder(!filterOrder)}> <Text style={[{ paddingHorizontal: 10 }]}>{filterOrder ? "DESC" : "ASC"}</Text> </TouchableOpacity>
            </View>
            <View style={[styles.table_header]}>
                <Text style={[styles.heading]}>ID</Text>
                <Text style={[styles.heading]}>User</Text>
                <Text style={[styles.heading]}>Book</Text>
                <Text style={[styles.heading]}>Date Requested</Text>
                <Text style={[styles.heading]}>Date Lent</Text>
                <Text style={[styles.heading]}>Date Returned</Text>
                <Text style={[styles.heading]}>{isAdmin ? "Actions" : ""}</Text>
            </View>
            <FlatList
                style={{ flex: 1 }}
                data={filteredLogs}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.cell}>{item.id}</Text>
                        <Text style={styles.cell}>{item.userid}</Text>
                        <Text style={styles.cell}>{item.bookid}</Text>
                        <Text style={styles.cell}>{item.dateRequested}</Text>
                        <Text style={styles.cell}>{item.dateLent || ''}</Text>
                        <Text style={styles.cell}>{item.dateReturned || ''}</Text>
                        <Text style={styles.cell}>{isAdmin ? 'Edit' : ''}</Text>
                        <TouchableOpacity onPress={() => deleteLogs([item.id])}><Text style={styles.cell}>{isAdmin ? 'Delete' : ''}</Text></TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};
