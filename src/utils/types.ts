import {ReactNode} from 'react';
import {User as FirebaseUser} from 'firebase/auth';
import {DocumentReference} from 'firebase/firestore';

export interface Props {
  children?: ReactNode;
}

export type CurrentUser = FirebaseUser | null;

export interface User {
  id: string;
  ref: DocumentReference;
  displayName: string;
  userName: string;
  uid: string;
  photoURL: string;
}

export interface AuthContextInterface {
  currentUser: CurrentUser;
  user: User;
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

export interface FileUploadStateProps {
  uploading: boolean;
  progress: number;
  downloadURL: string;
  file: File | null;
}
