import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'
import React, { createContext, ReactNode, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fbAuth, googleAuth, fbFireStore } from '../lib/firebase'
import { AuthContextInterface, CurrentUser } from '../utils/types'

const AuthContext = createContext({} as AuthContextInterface)

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser>(null)
    const [newUser, setNewUser] = useState<boolean | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    let navigate = useNavigate()
    let dbRef = fbFireStore.collection(' usernames')

    const checkUserName = async (uid: string) => {
        const userNameRef = dbRef.where('uid', '==', uid)
        const snapShot = await userNameRef.get()

        if (snapShot.empty) {
            console.log('new user')
            navigate('/new-profile')
        } else {
            console.log('old user')
        }
        //    navigate('/');
    }

    const logInWithGoogle = async () => {
        console.log('object')
        return signInWithPopup(fbAuth, googleAuth)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential =
                    GoogleAuthProvider.credentialFromResult(result)
                const token = credential?.accessToken
                // The signed-in user info.
                const user = result.user
                // setCurrentUser(user);
                // ...
                const { uid, displayName, photoURL } = user
                if (user) {
                    checkUserName(uid)
                    console.log(uid, displayName, photoURL)
                }
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code
                const errorMessage = error.message
                // The email of the user's account used.
                const email = error.email
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error)
                setError(errorMessage)
                // ...
            })
    }
    const signOutUser = () => {
        signOut(fbAuth)
            .then(() => {
                console.log('// Sign-out successful.')
                navigate('/')
            })
            .catch((error) => {
                // An error happened.
            })
    }

    React.useEffect(() => {
        const unsubscribe = fbAuth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            //FIXME: memory leak issue
            //stores information about current logged userPass
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])
    const values = {
        currentUser,
        logInWithGoogle,
        signOutUser,
        loading,
        error,
    }
    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    )
}
