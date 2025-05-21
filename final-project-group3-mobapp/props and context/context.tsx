import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'librarian' | 'user';
};

export type Book = {
  id: string;
  title: string;
  authors: string;
  synopsis: string;
  cover: string; // image URI
  publisher: string;
  year: string;
  acquisitionDate: string;
  isbn: string;
  edition: string;
  genres: string;
  copies: number;
  available: number;
};

type ContextType = {
  books: Book[];
  addBook: (book: Book) => void;
  updateBooks: (books: Book[]) => void;
  admin: User[];
  users: User[];
  librarians: User[];
  setAdmin: React.Dispatch<React.SetStateAction<User[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setLibrarians: React.Dispatch<React.SetStateAction<User[]>>;
  borrowedBooks: string[];
  favoriteBooks: string[];
  toggleBorrow: (bookId: string) => void;
  toggleFavorite: (bookId: string) => void;
  currentAccount: User | null;
  setCurrentAccount: React.Dispatch<React.SetStateAction<User | null>>;
};

export const Context = createContext<ContextType>({
  books: [],
  addBook: () => {},
  updateBooks: () => {},
  admin: [],
  users: [],
  librarians: [],
  setAdmin: () => {},
  setUsers: () => {},
  setLibrarians: () => {},
  borrowedBooks: [],
  favoriteBooks: [],
  toggleBorrow: () => {},
  toggleFavorite: () => {},
  currentAccount: null,
  setCurrentAccount: () => {},
});

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [admin, setAdmin] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [librarians, setLibrarians] = useState<User[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<string[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);
  const [currentAccount, setCurrentAccount] = useState<User | null>(null);

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
      if (storedFavorites) setFavoriteBooks(JSON.parse(storedFavorites));
    })();
  }, []);

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
  };

  return (
    <Context.Provider
      value={{
        books,
        addBook,
        updateBooks,
        admin,
        users,
        librarians,
        setAdmin,
        setUsers,
        setLibrarians,
        borrowedBooks,
        favoriteBooks,
        toggleBorrow,
        toggleFavorite,
        currentAccount,
        setCurrentAccount,
      }}
    >
      {children}
    </Context.Provider>
  );
};