import { useState, ReactNode, useEffect, createContext } from "react";
import { ImageSourcePropType } from "react-native";
//import AsyncStorage from "@react-native-async-storage/async-storage";


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
    availability: boolean //Available, Checked-Out
}

type ContextProviderType = {
    books: Book[];
    genres: string[];
};

interface ContextProviderProps {
    children: ReactNode;
}

export const Context = createContext<ContextProviderType>({
    books: [],
    genres: []
});

export const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [genres, setGenres] =  useState<string[]>([
        'Fiction', 'Poetry', 'Plays', 'German'
    ])

    const [books, setBooks] = useState<Book[]>([
        {
            id: '1',
            title: 'The Wings',
            author: ['Yi Sang'],
            synopsis: 'The Wings is a short novel written by the Korean author Yi Sang in 1936 and published in magazine Jo-Gwang. It is one of the representative works in psychologism or intellectualism literature from the 1930s. It expresses anxiety, self-consciousness, depression and ego destruction.',
            cover:require('../assets/The Wings.jpg'), 
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
            synopsis: 'Goethe’s Faust reworks the late medieval myth of a brilliant scholar so disillusioned he resolves to make a contract with Mephistopheles. The devil will do all he asks on Earth and seeks to grant him a moment in life so glorious that he will wish it to last forever. But if Faust does bid the moment stay, he falls to Mephistopheles and must serve him after death. In this first part of Goethe’s great work, the embittered thinker and Mephistopheles enter into their agreement, and soon Faust is living a rejuvenated life and winning the love of the beautiful Gretchen. But in this compelling tragedy of arrogance, unfulfilled desire, and self-delusion, Faust heads inexorably toward an infernal destruction.',
            cover:require("../assets/Goethe's Faust.jpg"), 
            publisher: 'Vintage Books',
            pubYear: 1962,
            acqDate: '2025-05-16',
            ISBN: '9780385031141',
            genre: ['Fiction', 'Plays', 'Poetry', 'German'],
            copies: 2,
            availability: true,
        },

    ]);
    /*
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
        <Context.Provider value={{ books, genres }}>
            {children}
        </Context.Provider>
    );
};