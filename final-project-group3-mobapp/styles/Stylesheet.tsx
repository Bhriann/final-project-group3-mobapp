
import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({

  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
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

  title: {
    fontFamily: "Grotesk_Medium",
    fontSize: 30,
    marginTop: 20,

  },
  profileTitle: {
    fontFamily: "Grotesk_Medium",
    fontSize: 30,
    marginBottom: 5,
  },
  infotitle: {
    fontFamily: "Grotesk_Medium",
    fontSize: 30,
  },
  infoyear: {
    fontFamily: "Grotesk_Light",
    fontSize: 12,
  },
  mediumfont: {
    fontFamily: "Grotesk_Medium",
  },
  input: {

    paddingLeft: 10,
    marginTop: 10,
    width: "100%",
    height: 40,
    borderRadius: 30,
    alignSelf: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },

  inputText: {
    flex: 1,
    fontSize: 16,
    padding: 2,
    fontFamily: "Grotesk_Medium"
  },

  buttonContainer: {
    backgroundColor: '#2A53A0',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius: 5,
    marginTop:20,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:"Grotesk_Medium"
  },

  showButtonText: {
    color: '#2A53A0',
    fontWeight: 'bold',
    paddingRight: 10,
  
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
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  heading: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  cell: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    color: '#555',
    padding: 4,
  },
  actionCell: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 40,
  },
  scrollLib: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  scrollInfo: {
    justifyContent: 'center',
    padding: 40,
  },
  scrollProfile: {
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  emptyProfile: {
    fontFamily: "Grotesk_Regular",
    paddingBottom: 20
  },
  profileSection: {
    paddingBottom: 30
  },

  signupText: {
    color: '#2F5B94',
    marginTop: 20,
    textAlign: 'center',
    fontFamily: "Grotesk_Light"
  },
  errorText: {
    color: 'red',
    backgroundColor: '#EAB2A5',
    borderRadius: 10,
    marginVertical: 10,
    marginLeft: 10,
    borderColor: 'red',
    borderWidth: 1,
    padding: 6,
    fontFamily: "Grotesk_Light",
    fontSize: 12
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  warningText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  warningButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  dismissButton: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  dismissButtonText: {
    color: '#333',
    fontWeight: 'bold',
   
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileHeader: {
    marginTop: 60,
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Grotesk_Medium',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    fontFamily: 'Grotesk_Regular',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  labelStyle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  errorStyle: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },

  bookTitle: {
    fontFamily: "Grotesk_Medium",
    color: "#fff",
    fontSize: 12,
  },
  bookAuthor: {
    color: "rgb(191, 191, 191)",
    fontFamily: "Grotesk_Regular",
    fontSize: 10,
  },
  bookCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  bookCover: {
    width: '100%',
    aspectRatio: 2 / 3,
    resizeMode: 'cover',
    borderRadius: 8,
  },

  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: "30%",
    height: "20%",
  },

  overlayTextContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    fontFamily: "Grotesk_Regular",
    backgroundColor: "#fff",
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bookFlatlistContainer: {
    padding: 10,
    flex: 1
  },

  bookItemContainer: {
    position: 'relative',
    width: '100%',
    height: 220, // Fixed height per item
    justifyContent: 'center',
    alignItems: 'center',
  },
  //BOOK PAGE
  author: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: "Grotesk_Regular",
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontFamily: "Grotesk_Light",
  },
  synopsis: {
    fontSize: 14,
    marginVertical: 10,
    color: '#333',
    fontFamily: "Grotesk_Regular",
    textAlign: "justify",
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 16,
  },
});