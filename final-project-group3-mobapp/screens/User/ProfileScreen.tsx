import React, { useState, useContext } from 'react';
import { SafeAreaView, Text, View} from 'react-native';
//import { FontAwesome } from '@expo/vector-icons';
import { styles } from '../../styles/Stylesheet';
import { Context } from '../../props and context/context';

const ProfileScreen: React.FC = () => {
    const [showMenu, setShowMenu] = useState(false);

    //add the parameters here coming from context.tsx
    const {currentAccount} = useContext(Context);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile Screen! </Text>
                
            </View>
            <View style={styles.body}>
                <Text>Insert User Favorites filtered Via currentAccount parameter</Text>
                <Text>Insert Borrowing Logs filtered Via currentAccount parameter</Text>
            </View>
        </SafeAreaView>
    );
};

export default ProfileScreen;


