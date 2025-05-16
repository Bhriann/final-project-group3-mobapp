import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      backgroundColor: '#e0e0e0',
    },
    headerTitle: {
      fontSize: 20,
      marginLeft: 15,
    },
    body: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },

    LogInContainer: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      marginBottom: 15,
      borderRadius: 5,
      width: '90%',
      maxWidth: 400,
      alignSelf: 'center',
      backgroundColor: '#fff',
    },
    buttonContainer: {
      backgroundColor: '#007BFF',
      paddingVertical: 15,
      borderRadius: 5,
      width: '90%',
      maxWidth: 400,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    }
  });