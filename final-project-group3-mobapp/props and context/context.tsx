import { useState, ReactNode, useEffect, createContext } from "react";
import { ImageSourcePropType } from "react-native";
//import AsyncStorage from "@react-native-async-storage/async-storage";


//Change the content in the interfaces if you need to modify any information inside these objects
// BOOK TYPES
interface Book {
    id: string;
    title: string;
    author: string[];
    synopsis: string;
    cover: ImageSourcePropType;
    publisher: string;
    pubYear: number;
    acqDate: string;
    ISBN: string;
    genre: string[];
    copies: number;
    availability: boolean;  //Available, Checked-Out
}

// ACCOUNT TYPE
interface Accounts {
    id: string;
    username: string;
    email: string;
    password: string;
}

// LOG TYPE
interface BorrowingLog {
    id: string;
    bookid: string;
    userid: string;
    dateRequested: string;
    dateLent: string | undefined;
    dateReturned: string | undefined;
}

// FAVORITES TYPE
interface Favorites {
    id: string;
    userid: string;
    bookids: string[];
}

// CONTEXT TYPE
type ContextProviderType = {
    books: Book[];
    genres: string[];
    admin: Accounts[];
    librarians: Accounts[];
    users: Accounts[];
    setUsers: React.Dispatch<React.SetStateAction<Accounts[]>>; // 
    logs: BorrowingLog[];
    favorites: Favorites[];
    currentAccount: string; //current ID ng User Account to keep track of their favorites and their borrowing logs.
    setAccount: (id: string) => void;

    isAdmin: boolean; //0 - Librarian, 1 - Admin

    /*logs
    logFilterMode: string,  //All, Requested, Checked-Out, Returned
    filterMode: (mode:string) => void;
    */

    deleteLogs: (logs_del: string[]) => void;
};

interface ContextProviderProps {
    children: ReactNode;
}

export const Context = createContext<ContextProviderType>({
    books: [],
    genres: [],
    admin: [],
    librarians: [],
    users: [],
    setUsers: () => {}, // 
    logs: [],
    favorites: [],
    currentAccount: "",
    setAccount: () => {},
    isAdmin: true,

    deleteLogs: () => {},
    /*logs

    logFilterMode: "", 
    filterMode: () => {},
    */
});

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [genres, setGenres] = useState<string[]>([
        'Fiction', 'Poetry', 'Plays', 'German'
    ]);

    const [admin, setAdmin] = useState<Accounts[]>([  //Initialized Admin
        { id: "AD000000", username: "Admin", email: "admin@example.com", password: "admin123" },
    ]);

    const [librarians, setLibrarians] = useState<Accounts[]>([
        { id: "LB000000", username: "John", email: "john@example.com", password: "john123" },
        { id: "LB000001", username: "Mary", email: "mary@example.com", password: "mary123" },  //Initialized Two Librarians
    ]);

    const [users, setUsers] = useState<Accounts[]>([
        { id: "US000001", username: "Peter", email: "peter@example.com", password: "peter123" }, //Initialized One User
    ]);

    const [logs, setLogs] = useState<BorrowingLog[]>([
        { id: "1", bookid: "1", userid: "US000001", dateRequested: "2025-05-10", dateLent: "2025-05-11", dateReturned: undefined },
        { id: "2", bookid: "2", userid: "US000001", dateRequested: "2025-05-10", dateLent: undefined, dateReturned: undefined },
        { id: "3", bookid: "1", userid: "US000002", dateRequested: "2025-05-10", dateLent: "2025-05-17", dateReturned: "2025-05-18" },
        { id: "4", bookid: "2", userid: "US000002", dateRequested: "2025-05-10", dateLent: "2025-05-17", dateReturned: "2025-05-18" },
        { id: "5", bookid: "2", userid: "US000002", dateRequested: "2025-05-10", dateLent: "2025-05-17", dateReturned: "2025-05-18" },
     { id: "6", bookid: "2", userid: "US000002", dateRequested: "2025-05-10", dateLent: "2025-05-17", dateReturned: "2025-05-18" },
    ])

    const [favorites, setFavorites] = useState<Favorites[]>([
        { id: "1", userid: "1", bookids: ["1"] }
    ]);

    const [books, setBooks] = useState<Book[]>([
        {
            id: '1',
            title: 'The Wings',
            author: ['Yi Sang'],
            synopsis: 'The Wings is a short novel written by the Korean author Yi Sang in 1936 and published in magazine Jo-Gwang. It is one of the representative works in psychologism or intellectualism literature from the 1930s. It expresses anxiety, self-consciousness, depression and ego destruction.',
            cover: require('../assets/The Wings.jpg'),
            publisher: 'Jimoondang Publishing Company',
            pubYear: 2001,
            acqDate: '2025-05-16',
            ISBN: '9788988095508',
            genre: ['Novel', 'Fiction'],
            copies: 2,
            availability: true,
        },
        {
            id: '2',
            title: "Goethe's Faust",
            author: ['Johann Wolfgang von Goethe'],
            synopsis: 'Goethe’s Faust reworks the late medieval myth of a brilliant scholar so disillusioned he resolves to make a contract with Mephistopheles. The devil will do all he asks on Earth and seeks to grant him a moment in life so glorious that he will wish it to last forever. But if Faust does bid the moment stay, he falls to Mephistopheles and must serve him after death...',
            cover: require("../assets/Goethe's Faust.jpg"),
            publisher: 'Vintage Books',
            pubYear: 1962,
            acqDate: '2025-05-16',
            ISBN: '9780385031141',
            genre: ['Fiction', 'Plays', 'Poetry', 'German'],
            copies: 2,
            availability: true,
        },
    ]);

    const [currentAccount, setCurrentAccount] = useState<string>("LB000000");

    const [isAdmin, setisAdmin] = useState<boolean>(true);

   /*const [logFilterMode, setLogFilterMode] = useState<string>("Checked-In");

    const filterMode = (mode:string) => {
        setLogFilterMode(mode);
    }
*/
    const setAccount = (type:string) => {
        setCurrentAccount(type);
    }    //set if user is an admin, libarian or user


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
        <Context.Provider value={{ books, genres, admin, librarians, users, logs, favorites, currentAccount, setAccount, isAdmin, deleteLogs, setUsers}}>
            {children}
        </Context.Provider>
    );
};
