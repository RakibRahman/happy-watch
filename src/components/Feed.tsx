import React, {useEffect, useState} from 'react';
import {getStorage, ref, listAll, getDownloadURL} from 'firebase/storage';
import {fbStorage} from '../lib/firebase';

const Feed = () => {
  const [folders, setFolders] = useState<any>([]);

  const getVideoLinks = () => {
    const listRef = ref(fbStorage, 'videos/uygH8guxf4bh4NXh2aGmYLUFB2s1');
    listAll(listRef)
      .then(res => {
        res.prefixes.forEach(folderRef => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
          // console.log('folderRef',folderRef.fullPath)
          console.log(folderRef);
          // setFolders(folderRef)
        });
        res.items.forEach(itemRef => {
          // All the items under listRef.
          // console.log(itemRef.bucket)
          getDownloadURL(itemRef).then(downloadURL => {
            //  console.log(downloadURL)
            //  let arr = new Array(downloadURL)
            //  setFolders(folders.push(downloadURL));
            // setFolders([...folders,...arr]);
            // console.log(folders)
          });
        });
      })
      .catch(error => {
        // Uh-oh, an error occurred!
        console.log('video fetch error');
      });
  };

  useEffect(() => {
    // getVideoLinks();
  }, []);

  useEffect(() => {
    console.log(folders.length);
  }, [folders]);
  return <div>Feed</div>;
};

export default Feed;
