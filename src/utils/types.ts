import {ReactNode} from 'react';
import {User as FirebaseUser} from 'firebase/auth';

export interface Props {
  children?: ReactNode;
}

export type CurrentUser = FirebaseUser | null;

export interface AuthContextInterface {
  currentUser: CurrentUser;
  user: any;
  error: string;
  loading: boolean;
  logInWithGoogle: () => void;
  logInWithFacebook: () => void;
  signOutUser: () => void;
  accountWithEmail: (email: string, password: string) => void;
  logInWithEmail: (email: string, password: string) => void;
}

export interface ModalProps {
  onClose: () => void;
  currentUser: CurrentUser;
}

export interface FormState {
  email: string;
  password: string;
  repeatPassword?: string;
}
