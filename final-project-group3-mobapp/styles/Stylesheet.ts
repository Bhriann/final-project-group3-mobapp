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
    },
    passwordInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 15,
      backgroundColor: '#fff',
      width: '90%',
      maxWidth: 400,
      alignSelf: 'center',
    },

    passwordInput: {
      flex: 1,
      padding: 10,
    },

    showButton: {
      paddingHorizontal: 10,
      paddingVertical: 10,
    },

    showButtonText: {
      color: '#007BFF',
      fontWeight: 'bold',
    },

      sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'center',
  },
  listItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 5,
  marginBottom: 10,
  backgroundColor: '#fff',
  width: '90%',
  alignSelf: 'center',
  flexWrap: 'wrap', 
  },

  listItemText: {
  fontSize: 14,
  flexShrink: 1,
  flexWrap: 'wrap',
  },

  deleteButton: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  roleButton: {
  flex: 1,
  padding: 12,
  borderRadius: 5,
  backgroundColor: '#e0e0e0',
  marginHorizontal: 5,
  alignItems: 'center',
},

roleButtonSelected: {
  backgroundColor: '#007BFF',
  borderWidth: 1,
  borderColor: '#005FCC',
},

cancelButton: {
  padding: 12,
  borderRadius: 5,
  backgroundColor: '#ccc',
  alignItems: 'center',
  width: '48%',
},

cancelButtonText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
    table_header: {
    flexDirection: 'row',
    justifyContent:'space-between',
    padding: 10,
  },

  heading: {
    flex: 1,
    fontSize: 12,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent:'space-between',
    padding: 10,
    marginVertical: 1,
    backgroundColor: '#fff',
    elevation: 1,
    borderRadius: 3,
  },
  cell: {
    flex: 1,
    fontSize: 10,
    textAlign: 'left',
  }
  
});