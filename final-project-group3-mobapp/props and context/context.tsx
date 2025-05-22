import { useState, ReactNode, useEffect, createContext, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ImageSourcePropType } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';

//BOOK TYPES
export interface Book {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  cover: string; // image URI
  publisher: string;
  year: string;
  acqDate: string;
  isbn: string;
  edition: string;
  genres: string;
  copies?: number;
}

//ACCOUNT TYPE
interface Accounts {
  id: string;
  username: string;
  email: string;
  password: string;
}

//LOG TYPE
export interface BorrowingLog {
  id: string;
  bookid: string;
  userid: string;
  dateRequested: string;
  dateLent: string | undefined;
  dateReturned: string | undefined;
}

//FAVORITES TYPE
interface Favorites {
  id: string;
  userid: string;
  bookids: string[];
}

//Define Objects here with their types
type ContextType = {
  //COMMON DATA
  books: Book[];  //Book Object List
  genres: string[];   //Genre List
  logs: BorrowingLog[];   //Log Accounts

  //USERS
  admin: Accounts[];  //Admin Accounts
  librarians: Accounts[]; //Librarian Accounts
  users: Accounts[];  //User Accounts
  setAdmin: React.Dispatch<React.SetStateAction<Accounts[]>>;
  setUsers: React.Dispatch<React.SetStateAction<Accounts[]>>;
  setLibrarians: React.Dispatch<React.SetStateAction<Accounts[]>>;

  //USER DATA
  favoriteBooks: Favorites[]; //Favorite Accoutns
  toggleFavorite: (bookId: string) => void;
  borrowHistory: Book[];
  favoriteBooksList: Book[];

  //Persistent User Account
  currentAccount: string; //current ID ng User Account to keep track of their favorites and their borrowing logs.
  setCurrentAccount: (type: string) => void;

  //Book Data
  addBook: (book: Book) => void;
  updateBooks: (books: Book[]) => void;

  // Persistent Book Data
  selectedBook: string;
  setSelectedBookId: (bookid: string) => void;

  //Logs
  deleteLogs: (logs_del: string[]) => void;
  setLogs: React.Dispatch<React.SetStateAction<BorrowingLog[]>>;
};

interface ContextProviderProps {
  children: ReactNode;
}

export const Context = createContext<ContextType>({
  //COMMON DATA
  books: [],  //Book Object List
  genres: [],   //Genre List
  logs: [],   //Log Accounts

  //USERS
  admin: [],  //Admin Accounts
  librarians: [], //Librarian Accounts
  users: [],  //User Accounts
  setAdmin: () => { },
  setUsers: () => { },
  setLibrarians: () => { },

  //USER DATA
  favoriteBooks: [], //Favorite Accoutns
  toggleFavorite: () => { },
  borrowHistory: [],
  favoriteBooksList: [],

  //Persistent User Account
  currentAccount: "", //current ID ng User Account to keep track of their favorites and their borrowing logs.
  setCurrentAccount: () => { },

  //Book Data
  addBook: () => { },
  updateBooks: () => { },

  // Persistent Book Data
  selectedBook: "",
  setSelectedBookId: () => { },

  //Logs
  deleteLogs: () => { },
  setLogs: () => { },
});

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [favoriteBooks, setFavoriteBooks] = useState<Favorites[]>([]);
  const [genres, setGenres] = useState<string[]>([
    'Fiction', 'Poetry', 'Plays', 'German'
  ])

  const [admin, setAdmin] = useState<Accounts[]>([
    { id: "AD000000", username: "Admin", email: "admin@example.com", password: "admin123" },   //Initialized Admin,
  ])

  const [librarians, setLibrarians] = useState<Accounts[]>([
    { id: "LB000000", username: "John", email: "john@example.com", password: "john123" },   //Initialized Two Librarians
    { id: "LB000001", username: "Mary", email: "mary@example.com", password: "mary123" },
  ])

  const [users, setUsers] = useState<Accounts[]>([
    { id: "US000001", username: "Peter", email: "peter@example.com", password: "peter123" },   //Initialized One User
  ])

  //Logs Event Handlers
  const [logs, setLogs] = useState<BorrowingLog[]>([
    { id: "1", bookid: "1", userid: "US000001", dateRequested: "2025-05-10", dateLent: "2025-05-11", dateReturned: undefined }
  ])

  const deleteLogs = async (logs_del: string[]) => {
    setLogs(prevLogs => prevLogs.filter(prevLog => !logs_del.includes(prevLog.id)));
  }

  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'The Wings',
      author: 'Yi Sang',
      synopsis: 'The Wings is a short novel written by the Korean author Yi Sang in 1936 and published in magazine Jo-Gwang. It is one of the representative works in psychologism or intellectualism literature from the 1930s. It expresses anxiety, self-consciousness, depression and ego destruction.',
      cover: encodeURI(require('../assets/The Wings.jpg')),
      publisher: 'Jimoondang Publishing Company',
      year: '2001',
      acqDate: '2025-05-16',
      isbn: '9788988095508',
      genres: 'Novel',
      copies: 2,
      edition: "1"
    },
    {
      id: '2',
      title: "Goethe's Faust",
      author: 'Johann Wolfgang von Goethe',
      synopsis: 'Goethe’s Faust reworks the late medieval myth of a brilliant scholar so disillusioned he resolves to make a contract with Mephistopheles. The devil will do all he asks on Earth and seeks to grant him a moment in life so glorious that he will wish it to last forever. But if Faust does bid the moment stay, he falls to Mephistopheles and must serve him after death. In this first part of Goethe’s great work, the embittered thinker and Mephistopheles enter into their agreement, and soon Faust is living a rejuvenated life and winning the love of the beautiful Gretchen. But in this compelling tragedy of arrogance, unfulfilled desire, and self-delusion, Faust heads inexorably toward an infernal destruction.',
      cover: "",
      publisher: 'Vintage Books',
      year: '1962',
      acqDate: '2025-05-16',
      isbn: '9780385031141',
      genres: 'Fiction',
      copies: 2,
      edition: "1"
    },

  ]);

  useEffect(() => {
    const loadState = async () => {
      const storedBooks = await AsyncStorage.getItem('books');
      if (storedBooks) setBooks(JSON.parse(storedBooks));

      const storedAdmin = await AsyncStorage.getItem('admin');
      if (storedAdmin) setAdmin(JSON.parse(storedAdmin));

      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));

      const storedLibrarians = await AsyncStorage.getItem('librarians');
      if (storedLibrarians) setLibrarians(JSON.parse(storedLibrarians));

      const storedFavorites = await AsyncStorage.getItem('favoriteBooks');
      if (storedFavorites) setFavoriteBooks(JSON.parse(storedFavorites));

      const storedLogs = await AsyncStorage.getItem('logs');
      if (storedLogs) setLogs(JSON.parse(storedLogs));
    };

    loadState();
  }, [logs]);

  const [isAdmin, setisAdmin] = useState<boolean>(true);
  const addBook = async (book: Book) => {
    const updated = [...books, book];
    setBooks(updated);
    await AsyncStorage.setItem('books', JSON.stringify(updated));
  };

  const updateBooks = async (updatedBooks: Book[]) => {
    setBooks(updatedBooks);
    await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
  };

  const saveFavorites = async (updatedFavorites: Favorites[]) => {
    await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavoriteBooks(updatedFavorites);
  };

  const toggleFavorite = async (bookId: string) => {

    setFavoriteBooks((prevFavorites) => {
      const userFavorites = prevFavorites.find(fav => fav.userid === currentAccount);
console.log("toggled")
      if (!userFavorites) {
        // User doesn't have any favorites yet — create new entry
        const newFavorites: Favorites = {
          id: Date.now().toString(), // simple ID generation
          userid: currentAccount,
          bookids: [bookId],
        };

        const updated = [...prevFavorites, newFavorites];
        saveFavorites(updated);
        return updated;
      }

      // User already has favorites — update their list
      const updatedBookIds = userFavorites.bookids.includes(bookId)
        ? userFavorites.bookids.filter(id => id !== bookId)
        : [...userFavorites.bookids, bookId];

      const updatedFavorites = prevFavorites.map(fav =>
        fav.userid === currentAccount
          ? { ...fav, bookids: updatedBookIds }
          : fav
      );

      saveFavorites(updatedFavorites);
      return updatedFavorites;
    });
  };



  //Non-Persistent Handlers
  const [currentAccount, setCurrentAccount] = useState<string>("") //Set the id of the user for borrowing, favorites, and admin-librarian checks
  const [selectedBook, setSelectedBookId] = useState<string>(""); //Set the current Book to be used by the RenderBookPage Component.

  const borrowHistory = useMemo(() => {
    if (!logs || !books || !currentAccount) return [];

    const userLogs = logs.filter(log => log.userid === currentAccount);
    const userBookIds = userLogs.map(log => log.bookid);

    return books.filter(book => userBookIds.includes(book.id));
  }, [logs, books, currentAccount]);

  const favoriteBooksList = useMemo(() => {
    if (!favoriteBooks || !books || !currentAccount) return [];

    const userFavorites = favoriteBooks.find(fav => fav.userid === currentAccount)?.bookids || [];

    return books.filter(book => userFavorites.includes(book.id));
  }, [favoriteBooks, books, currentAccount]);

  /* Fonts paki-ignore muna
 const [fontsLoaded] = useFonts({
   Grotesk_Bold: require("../assets/ClashGrotesk-Bold.otf"),
   Grotesk_Extralight: require("../assets/ClashGrotesk-Extralight.otf"),
   Grotesk_Light: require("../assets/ClashGrotesk-Light.otf"),
   Grotesk_Medium: require("../assets/ClashGrotesk-Medium.otf"),
   Grotesk_Regular: require("../assets/ClashGrotesk-Regular.otf"),
   Grotesk_Semibold: require("../assets/ClashGrotesk-Semibold.otf"),
 });
 
*/
  return (
    //Call The UseStates here
    <Context.Provider value={{
      //COMMON DATA
      books,
      genres,
      logs,

      //USERS
      admin,
      librarians,
      users,
      setAdmin,
      setUsers,
      setLibrarians,

      //USER DATA
      favoriteBooks,
      toggleFavorite,
      borrowHistory,
      favoriteBooksList,

      //Persistent User Account
      currentAccount,
      setCurrentAccount,

      //Book Data
      addBook,
      updateBooks,

      // Persistent Book Data
      selectedBook,
      setSelectedBookId,

      //Logs
      deleteLogs,
      setLogs,
    }}>
      {children}
    </Context.Provider>
  );
};
