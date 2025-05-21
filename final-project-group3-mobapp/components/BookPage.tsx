import React, { useContext } from "react";
import { FlatList, View, Text, Image, TouchableOpacity } from "react-native";
import { Context } from "../props and context/context";
export const RenderBooks = () => {
    const { selectedBook, books } = useContext(Context);
    const book = books.find((book) => book.id === selectedBook);

    return (
        <View>
            {book &&
            <View style={[]}>
                
                <Image
                    source={require(book.cover)}
                    style={[]}
                    resizeMode="contain"
                />
                <Text style={[]}>ID: {book ? book.id: ""}</Text>
                <Text style={[]}>Title: {book ? book.title: ""}</Text>
            </View>
             }

            <TouchableOpacity
                onPress={() => {
                    // Add to Bookmarks Function;
                }}>
                <Text style={[]}>Bookmark</Text>
            </TouchableOpacity>
        </View>
    )
}