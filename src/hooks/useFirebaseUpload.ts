import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {nanoid} from 'nanoid';
import {fbStorage} from '../lib/firebase';
import {User, FileUploadStateProps} from '../utils/types';
import {useReducer, Reducer} from 'react';

export default function useFireBaseUpload(user: User) {
  const FileUploadState: FileUploadStateProps = {
    uploading: false,
    error: '',
    downloadURL: '',
    progress: 0,
  };

  type ACTIONTYPE =
    | {type: 'isUploading'; payload: boolean}
    | {type: 'error'; payload: string}
    | {type: 'progress'; payload: number}
    | {type: 'downloadLink'; payload: string};

  function reducer(state: typeof FileUploadState, action: ACTIONTYPE) {
    switch (action.type) {
      case 'isUploading':
        return {
          ...state,
          uploading: action.payload,
        };
      case 'error':
        return {...state, error: action.payload};
      case 'progress':
        return {...state, progress: action.payload};
      case 'downloadLink':
        return {...state, downloadLink: action.payload};
      default:
        throw new Error();
    }
  }
  const [state, dispatch] = useReducer(reducer, FileUploadState);
  const handleUpload = (file: File) => {
    const storageRef = ref(fbStorage, `videos/${user.uid}/${nanoid(10)}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        dispatch({type: 'isUploading', payload: true});
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log('Upload is ' + progress + '% done');
        dispatch({type: 'progress', payload: Math.round(progress)});
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
            // console.log('Upload is running');
            break;
        }
      },
      error => {
        switch (error.code) {
          case 'storage/unauthorized':
            dispatch({
              type: 'error',
              payload: "User doesn't have permission to access the object",
            });
            break;
          case 'storage/canceled':
            dispatch({type: 'error', payload: 'User canceled the upload'});
            break;

          case 'storage/quota-exceeded':
            dispatch({type: 'error', payload: 'User quota exceeded'});
            break;

          case 'storage/unknown':
            dispatch({
              type: 'error',
              payload: 'Unknown error occurred, inspect error.serverResponse',
            });
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          dispatch({type: 'downloadLink', payload: downloadURL});
        });
      },
    );
  };

  return {handleUpload, state, dispatch};
}
