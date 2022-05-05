import { useToast } from '@chakra-ui/react'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from 'firebase/auth'
import React, { createContext, ReactNode, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { facebookAuth, fbAuth, fbFireStore, googleAuth } from '../lib/firebase'
import { AuthContextInterface, CurrentUser } from '../utils/types'

const AuthContext = createContext({} as AuthContextInterface)

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<CurrentUser>(null)
    const [user, setUser] = useState<any | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    let navigate = useNavigate()
    const toast = useToast()
    let dbRef = fbFireStore.collection('usernames')

    const checkUserName = async (uid: string) => {
        const userNameRef = dbRef.where('uid', '==', uid)
        const snapShot = await userNameRef.get()

        if (snapShot.empty) {
            console.log('new user')
            navigate('/new-profile')
        } else {
            console.log('old user')
            // alert('user already exists')
            navigate('/')
            toast({
                title: 'Log In Successful!',
                status: 'success',
            })
        }
    }

    const logInWithGoogle = async () => {
        return signInWithPopup(fbAuth, googleAuth)
            .then((result) => {
                const user = result.user

                const { uid } = user
                if (user) {
                    checkUserName(uid)
                }
            })
            .catch((error) => {
                const errorMessage = error.message
                toast({
                    title: errorMessage,
                    status: 'error',
                })
            })
    }

    const accountWithEmail = (email: string, password: string) => {
        return createUserWithEmailAndPassword(fbAuth, email, password)
            .then((userCredential) => {
                const user = userCredential.user
                if (user) {
                    checkUserName(user.uid)
                }
            })
            .catch((error) => {
                const errorMessage = error.message
                toast({
                    title: errorMessage,
                    status: 'error',
                })
            })
    }

    const logInWithEmail = (email: string, password: string) => {
        return signInWithEmailAndPassword(fbAuth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user
                if (user) {
                    checkUserName(user.uid)
                }
                // ...
            })
            .catch((error) => {
                const errorMessage = error.message

                toast({
                    title: errorMessage,
                    status: 'error',
                })
            })
    }

    const logInWithFacebook = async () => {
        return signInWithPopup(fbAuth, facebookAuth)
            .then((result) => {
                const user = result.user
                console.log(user)
                const { uid } = user
                if (user) {
                    checkUserName(uid)
                }
            })
            .catch((error) => {
                const errorMessage = error.message
                setError(errorMessage)
                // ...
            })
    }
    const signOutUser = () => {
        signOut(fbAuth)
            .then(() => {
                toast({
                    title: 'Sign-out successful',
                    status: 'success',
                })
                navigate('/')
                setUser(null)
            })
            .catch((error) => {
                toast({
                    title: error.error.message,
                    status: 'error',
                })
            })
    }

    React.useEffect(() => {
        const unsubscribe = fbAuth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            //FIXME: memory leak issue
            //stores information about current logged userPass
            setLoading(false)
            if (user) {
                const ref = fbFireStore.doc(`users/${user.uid}`)
                ref.get().then((doc) => {
                    if (doc.exists) {
                        setUser({
                            id: doc.id,
                            ref: doc.ref,
                            ...doc.data(),
                        })
                    }
                })
            }
        })

        return () => unsubscribe()
    }, [])
    const values = {
        currentUser,
        user,
        logInWithGoogle,
        logInWithFacebook,
        signOutUser,
        loading,
        error,
        accountWithEmail,
        logInWithEmail,
    }
    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    )
}
