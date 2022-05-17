import React from 'react';
import FileUpload from './FileUpload';
import {Box, Text} from '@chakra-ui/react';
import {useAuth} from '../../context/AuthContext';
import useFireBaseUpload from '../../hooks/useFirebaseUpload';

const Upload = () => {
  const {user} = useAuth()!;
  const {handleUpload, state, dispatch, cancelUpload, discardUpload} =
    useFireBaseUpload(user);

  React.useEffect(() => {}, [user, state]);
  return (
    <Box>
      <Text> Upload video</Text>
      <Text>Post a video to {user && user.userName}</Text>
      <FileUpload
        user={user}
        handleUpload={handleUpload}
        state={state}
        cancelUpload={cancelUpload}
        discardUpload={discardUpload}
        dispatch={dispatch}
      />
    </Box>
  );
};

export default Upload;
