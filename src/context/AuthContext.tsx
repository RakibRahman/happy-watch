import React, {
    useState,
    useContext,
    createContext,
    FC,
    ReactNode,
} from 'react'
import firebase from 'firebase/compat/app'
import {fbAuth,googleAuth} from '../lib/firebase';
import { GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { User as FirebaseUser } from "firebase/auth";

interface Props {
    children?: ReactNode
}
type CurrentUser = FirebaseUser | null

interface AuthContextInterface {
    currentUser: CurrentUser,
    logInWithGoogle:()=>void;
}

const AuthContext = createContext({} as AuthContextInterface)

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthContextProvider: FC<Props> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser>(null);

   const logInWithGoogle =()=>{
       return signInWithPopup(fbAuth,googleAuth)
       .then((result) => {
         // This gives you a Google Access Token. You can use it to access the Google API.
         const credential = GoogleAuthProvider.credentialFromResult(result);
         const token = credential?.accessToken;
         // The signed-in user info.
         const user = result.user;
        setCurrentUser(user);
         // ...
       }).catch((error) => {
         // Handle Errors here.
         const errorCode = error.code;
         const errorMessage = error.message;
         // The email of the user's account used.
         const email = error.email;
         // The AuthCredential type that was used.
         const credential = GoogleAuthProvider.credentialFromError(error);
         // ...
       });
   }
    const values = {
        currentUser,
        logInWithGoogle
    }
    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    )
}
