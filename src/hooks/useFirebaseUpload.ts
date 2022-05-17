import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';
import {nanoid} from 'nanoid';
import {useReducer} from 'react';
import {fbStorage} from '../lib/firebase';
import {FileUploadStateProps, User, ACTIONTYPE} from '../utils/types';

import {useToast} from '@chakra-ui/react';

export default function useFireBaseUpload(user: User) {
  const toast = useToast();
  const FileUploadState: FileUploadStateProps = {
    uploading: false,
    downloadURL: '',
    progress: 0,
    file: null,
    fullPath: '',
    uploadTask: null,
  };

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
        return {...state, downloadURL: action.payload};
      case 'uploadTask':
        return {...state, uploadTask: action.payload};
      case 'getFullPath':
        return {...state, fullPath: action.payload};
      case 'cancelUpload':
        return (state = FileUploadState);
      default:
        throw new Error();
    }
  }

  const [state, dispatch] = useReducer(reducer, FileUploadState);
  const handleUpload = (file: File) => {
    const storageRef = ref(fbStorage, `videos/${user.uid}/${nanoid(10)}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    dispatch({type: 'uploadTask', payload: uploadTask});

    uploadTask.on(
      'state_changed',
      snapshot => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        dispatch({type: 'isUploading', payload: true});
        dispatch({type: 'file', payload: file});
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        dispatch({type: 'progress', payload: Math.round(progress)});
        switch (snapshot.state) {
          case 'paused':
            // console.log('Upload is paused');
            break;
          case 'running':
          // console.log('Upload is running');
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
          dispatch({
            type: 'getFullPath',
            payload: uploadTask.snapshot.ref.fullPath,
          });

          console.log('full', uploadTask.snapshot.ref.fullPath);
        });
      },
    );
  };

  const cancelUpload = async () => {
    if (state.uploadTask) {
      dispatch({type: 'cancelUpload'});
      await state.uploadTask.cancel();
    }
  };

  const discardUpload = async () => {
    // Create a reference to the file to delete
    const desertRef = ref(fbStorage, state.fullPath);
    console.log('del path', state.fullPath);
    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        toast({
          title: 'Successfully deleted',
          status: 'success',
        });
      })
      .catch(error => {
        toast({
          title: ' Uh-oh, an error occurred!',
          status: 'error',
        });
      });
  };

  return {handleUpload, state, dispatch, cancelUpload, discardUpload};
}
