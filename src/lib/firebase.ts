// Import the functions you need from the SDKs you need
import { getAuth,GoogleAuthProvider } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyAv6D5m_Jcu7jdttARBcO9rxaZwXVo_n-4',
    authDomain: 'happy-watch.firebaseapp.com',
    projectId: 'happy-watch',
    storageBucket: 'happy-watch.appspot.com',
    messagingSenderId: '467245438323',
    appId: '1:467245438323:web:fffb092cfda5d354ea2106',
}

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig)

const fbAuth = getAuth(app)
const fbFireStore = getFirestore(app)
const fbStorage = getStorage(app)
const googleAuth = new GoogleAuthProvider()
// const fbTimestamp = firebase.firestore.FieldValue.serverTimestamp()
// const increment = firebase.firestore.FieldValue.increment

export {  googleAuth, fbAuth, fbStorage, fbFireStore }
