import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {nanoid} from 'nanoid';
import {useReducer} from 'react';
import {fbStorage} from '../lib/firebase';
import {FileUploadStateProps, User} from '../utils/types';
import {useToast} from '@chakra-ui/react';

export default function useFireBaseUpload(user: User) {
  const toast = useToast();
  const FileUploadState: FileUploadStateProps = {
    uploading: false,
    downloadURL: '',
    progress: 0,
    file: null,
  };

  type ACTIONTYPE =
    | {type: 'isUploading'; payload: boolean}
    | {type: 'progress'; payload: number}
    | {type: 'file'; payload: File}
    | {type: 'downloadLink'; payload: string};

  function reducer(state: typeof FileUploadState, action: ACTIONTYPE) {
    switch (action.type) {
      case 'isUploading':
        return {
          ...state,
          uploading: action.payload,
        };
      case 'progress':
        return {...state, progress: action.payload};
      case 'file':
        return {...state, file: action.payload};
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
        dispatch({type: 'file', payload: file});
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
            toast({
              title: 'Unauthorized user',
              description: "User doesn't have permission to access the storage",
              status: 'error',
            });
            break;
          case 'storage/canceled':
            toast({
              title: 'Upload is canceled',
              description: 'User canceled the upload',
              status: 'error',
            });
            break;

          case 'storage/quota-exceeded':
            toast({
              title: 'Quota exceeded',
              description: 'User quota exceeded',
              status: 'error',
            });
            break;

          case 'storage/unknown':
            toast({
              title: 'Storage unknown',
              description:
                'Unknown error occurred, inspect error.serverResponse',
              status: 'error',
            });
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          dispatch({type: 'downloadLink', payload: downloadURL});
          toast({
            title: 'Uploading Completed',
          });
          dispatch({type: 'isUploading', payload: false});
        });
      },
    );
  };

  return {handleUpload, state, dispatch};
}
