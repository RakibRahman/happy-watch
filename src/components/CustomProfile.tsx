import React from 'react';
import {fbFireStore} from '../lib/firebase';
import {doc, getDoc} from 'firebase/firestore';

const CustomProfile = () => {
  const userInfo = async () => {
    const docRef = doc(fbFireStore, 'users', '0vqZ5xhqelabgRL2GPxSvjazkmF2');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  React.useEffect(() => {
    userInfo();
  }, []);
  return <div>CustomProfile</div>;
};

export default CustomProfile;
