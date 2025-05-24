import React, { useContext } from "react";
import { FlatList, View, Text, Image, TouchableOpacity } from "react-native";
import { Context } from "../props and context/context";
export const RenderBooks = () => {
    const { books } = useContext(Context);
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={books}
            keyExtractor={item => item.id}
            ListEmptyComponent={<Text style={[]}> No Books Yet...</Text>}
            renderItem={({ item }) => (

                <View style={[]}>
                    <View style={[]}>
                        {item.cover && (
                            <Image
                                source={{uri: item.cover}}
                                style={[]}
                                resizeMode="contain"
                            />
                        )}
                        <Text style={[]}>ID: {item.id}</Text>
                        <Text style={[]}>Title: {item.title}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                           // Add to Bookmarks Function;
                        }}>
                        <Text style={[]}>Bookmark</Text>
                    </TouchableOpacity>
                </View>


            )}
        />
    );
};
