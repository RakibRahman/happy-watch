import { signInWithPopup, signOut, signInWithRedirect } from 'firebase/auth'
import React, { createContext, ReactNode, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fbAuth, googleAuth, fbFireStore,facebookAuth } from '../lib/firebase'
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
               navigate('/');
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
                setError(errorMessage)
                // ...
            })
    };
    const logInWithFacebook = async () => {
        return signInWithRedirect(fbAuth, facebookAuth)
            .then((result) => {
               
                // const user = result.user
               console.log(result)
                // const { uid } = user
                // if (user) {
                //     checkUserName(uid)
                // }
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
                console.log('// Sign-out successful.')
                navigate('/')
                setUser(null);
            })
            .catch((error) => {
                // An error happened.
            })
    }

    React.useEffect(() => {
        const unsubscribe = fbAuth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            //FIXME: memory leak issue
            //stores information about current logged userPass
            setLoading(false)
            if(user){
                const ref = fbFireStore.doc(`users/${user.uid}`);
                ref.get().then((doc) => {
                    if(doc.exists){
                        setUser({
                            id:doc.id,
                            ref:doc.ref,
                            ...doc.data()
                        })
                    }
                })
            }
        })

        return () => unsubscribe();
    }, [])
    const values = {
        currentUser,
        user,
        logInWithGoogle,
        logInWithFacebook,
        signOutUser,
        loading,
        error,
    }
    return (
        <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
    )
}
