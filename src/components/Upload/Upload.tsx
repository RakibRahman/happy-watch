import React from 'react';
import FileUpload from './FileUpload';
import {Box, Text} from '@chakra-ui/react';
import {useAuth} from '../../context/AuthContext';
import useFireBaseUpload from '../../hooks/useFirebaseUpload';

const Upload = () => {
  const {user} = useAuth()!;
  const {handleUpload, state, dispatch} = useFireBaseUpload(user);

  React.useEffect(() => {
    console.log('Upload is ' + state.progress + '% done');
  }, [user, state]);
  return (
    <Box>
      <Text> Upload video</Text>
      <Text>Post a video to {user && user.userName}</Text>
      <FileUpload user={user} handleUpload={handleUpload} state={state} />
    </Box>
  );
};

export default Upload;
