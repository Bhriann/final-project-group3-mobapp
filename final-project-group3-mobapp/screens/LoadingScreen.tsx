import React from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../images/LibriLogo.png')} 
        style={styles.logo}
      />
      <Text style={styles.quote}>"The novel tool to manage your library!"</Text>
      <ActivityIndicator size="large" color="#0000ff" style={styles.activityIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Or your desired background color
  },
  logo: {
    width: 300, // Adjust size as needed
    height: 300, // Adjust size as needed
    resizeMode: 'contain',
    marginBottom: 20,
  },
  quote: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 10,
    color: '#333',
  },
  author: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#555',
  },
  activityIndicator: {
    marginTop: 20,
  },
});

export default LoadingScreen;