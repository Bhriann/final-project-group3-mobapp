
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;

  Admin: undefined;
  Librarian: undefined;
  User: undefined;

  AddBook: undefined;
  BookPage: undefined;
  AddLog: undefined;
  AddAccount: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;