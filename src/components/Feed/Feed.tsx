import React, {useEffect, useState} from 'react';
import {fbFireStore, fbStorage} from '../../lib/firebase';
import { collection, query, where, getDocs,getDoc,doc, } from "firebase/firestore";
import {useAuth} from '../../context/AuthContext';


const Feed = () => {

const getPostData =  async()=>{
  
  const querySnapshot = await getDocs(collection(fbFireStore, 'users'));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  

    // console.log(doc.id, " => ", doc.data());

  // console.log(doc.get('posts'))
  // console.log(doc.ref.firestore.app);
});


}

  useEffect(() => {
    // getUsers();
 getPostData();
  }, []);


  return <div>Feed</div>;
};

export default Feed;
