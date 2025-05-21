import { useState, ReactNode, useEffect, createContext } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ImageSourcePropType } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
//import AsyncStorage from "@react-native-async-storage/async-storage";

//Change the content in the interfaces if you need to modify any information inside these objects

//BOOK TYPES
interface Book {
  id: string;
  title: string;
  author: string[];
  synopsis: string;
  cover: string; // image URI
  publisher: string;
  year: string;
  acqDate: string;
  isbn: string;
  edition: string;
  genres: string[];
  copies: number;
  available: number;
}

//ACCOUNT TYPE
interface Accounts {
  id: string;
  username: string;
  email: string;
  password: string;
}

//LOG TYPE
interface BorrowingLog {
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
  books: Book[];  //Book Object List
  genres: string[];   //Genre List
  admin: Accounts[];  //Admin Accounts
  librarians: Accounts[]; //Librarian Accounts
  users: Accounts[];  //User Accounts
  logs: BorrowingLog[];   //Log Accounts
  favorites: Favorites[]; //Favorite Accoutns

  currentAccount: string; //current ID ng User Account to keep track of their favorites and their borrowing logs.
  setAccount: (id: string) => void;
  addBook: (book: Book) => void;
  updateBooks: (books: Book[]) => void;
  setAdmin: React.Dispatch<React.SetStateAction<Accounts[]>>;
  setUsers: React.Dispatch<React.SetStateAction<Accounts[]>>;
  setLibrarians: React.Dispatch<React.SetStateAction<Accounts[]>>;
  borrowedBooks: string[];
  favoriteBooks: string[];
  toggleBorrow: (bookId: string) => void;
  toggleFavorite: (bookId: string) => void;
  setCurrentAccount: (type: string) => void;
  isAdmin: boolean;
  deleteLogs: (logs_del: string[]) => void;
  setSelectedBookId: (bookid: string) => void;
  selectedBook: string;
};

interface ContextProviderProps {
  children: ReactNode;
}

export const Context = createContext<ContextType>({
  books: [],
  addBook: () => { },
  updateBooks: () => { },
  admin: [],
  users: [],
  librarians: [],
  setAdmin: () => { },
  setUsers: () => { },
  setLibrarians: () => { }, // 
  borrowedBooks: [],
  favoriteBooks: [],
  toggleBorrow: () => { },
  toggleFavorite: () => { },
  currentAccount: "",
  setCurrentAccount: () => { },
  isAdmin: true,
  deleteLogs: () => { },
  selectedBook: "",
  setSelectedBookId: () => { },
  genres: [],   //Genre List
  logs: [],   //Log Accounts
  favorites: [], //Favorite Accoutns
  setAccount: () => { },

  /*logs

  logFilterMode: "", 
  filterMode: () => {},
  */
});

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
  const [borrowedBooks, setBorrowedBooks] = useState<string[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);
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

  const [logs, setLogs] = useState<BorrowingLog[]>([
    { id: "1", bookid: "1", userid: "US000001", dateRequested: "2025-05-10", dateLent: "2025-05-11", dateReturned: undefined }
  ])

  const [favorites, setFavorites] = useState<Favorites[]>([
    { id: "1", userid: "1", bookids: ["1"] }
  ])


  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'The Wings',
      author: ['Yi Sang'],
      synopsis: 'The Wings is a short novel written by the Korean author Yi Sang in 1936 and published in magazine Jo-Gwang. It is one of the representative works in psychologism or intellectualism literature from the 1930s. It expresses anxiety, self-consciousness, depression and ego destruction.',
      cover: require('../assets/The Wings.jpg'),
      publisher: 'Jimoondang Publishing Company',
      year: '2001',
      acqDate: '2025-05-16',
      isbn: '9788988095508',
      genres: ['Novel', 'Fiction'],
      copies: 2,
      available: 0,
      edition: "1"
    },
    {
      id: '2',
      title: "Goethe's Faust",
      author: ['Johann Wolfgang von Goethe'],
      synopsis: 'Goethe’s Faust reworks the late medieval myth of a brilliant scholar so disillusioned he resolves to make a contract with Mephistopheles. The devil will do all he asks on Earth and seeks to grant him a moment in life so glorious that he will wish it to last forever. But if Faust does bid the moment stay, he falls to Mephistopheles and must serve him after death. In this first part of Goethe’s great work, the embittered thinker and Mephistopheles enter into their agreement, and soon Faust is living a rejuvenated life and winning the love of the beautiful Gretchen. But in this compelling tragedy of arrogance, unfulfilled desire, and self-delusion, Faust heads inexorably toward an infernal destruction.',
      cover: require("../assets/Goethe's Faust.jpg"),
      publisher: 'Vintage Books',
      year: '1962',
      acqDate: '2025-05-16',
      isbn: '9780385031141',
      genres: ['Fiction', 'Plays', 'Poetry', 'German'],
      copies: 2,
      available: 1,
      edition: "1"
    },

  ]);

  useEffect(() => {
    (async () => {
      const storedBooks = await AsyncStorage.getItem('books');
      if (storedBooks) setBooks(JSON.parse(storedBooks));

      const storedAdmin = await AsyncStorage.getItem('admin');
      if (storedAdmin) setAdmin(JSON.parse(storedAdmin));

      const storedUsers = await AsyncStorage.getItem('users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));

      const storedLibrarians = await AsyncStorage.getItem('librarians');
      if (storedLibrarians) setLibrarians(JSON.parse(storedLibrarians));

      const storedBorrowed = await AsyncStorage.getItem('borrowedBooks');
      if (storedBorrowed) setBorrowedBooks(JSON.parse(storedBorrowed));

      const storedFavorites = await AsyncStorage.getItem('favoriteBooks');
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
    })();
  }, []);

  
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

  const toggleBorrow = async (bookId: string) => {
    setBorrowedBooks(prev => {
      const newBorrowed = prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId];
      AsyncStorage.setItem('borrowedBooks', JSON.stringify(newBorrowed));
      return newBorrowed;
    });
  };

  const toggleFavorite = async (bookId: string) => {
    setFavoriteBooks(prev => {
      const newFavorites = prev.includes(bookId)
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId];
      AsyncStorage.setItem('favoriteBooks', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }; const [selectedBook, setSelectedBook] = useState<string>("");
  const [currentAccount, setCurrentAccount] = useState<string>("")

  const setAccount = (type: string) => setCurrentAccount(type);    //set if user is an admin, libarian or user
const setSelectedBookId = (bookid: string) => {setSelectedBook(bookid)};

 const deleteLogs = (logs_del:string[]) => {
       setLogs(prevLogs => prevLogs.filter(prevLog => !logs_del.includes(prevLog.id)));
    }
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
      books,
      addBook,
      updateBooks,
      admin,
      users,
      librarians,
      setAdmin,
      borrowedBooks,
      favorites,
      toggleBorrow,
      toggleFavorite,
      currentAccount,
      setCurrentAccount,
favoriteBooks,
      genres,
      setUsers,
      setLibrarians,
      logs,
      setAccount,
      isAdmin,
      deleteLogs,
      setSelectedBookId,
      selectedBook
    }}>
      {children}
    </Context.Provider>
  );
};
