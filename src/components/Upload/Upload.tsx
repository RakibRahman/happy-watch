import React from 'react';
import FileUpload from './FileUpload';
import {Box, Text} from '@chakra-ui/react';
import {useAuth} from '../../context/AuthContext';
import useFireBaseUpload from '../../hooks/useFirebaseUpload';

const Upload = () => {
  const {user} = useAuth()!;
  const {handleUpload} = useFireBaseUpload(user);

  React.useEffect(() => {
console.log(user);
  },[user])
  return (
    <Box>
      <Text> Upload video</Text>
      <Text>Post a video to {user && user.userName}</Text>
      <FileUpload user= {user} handleUpload={handleUpload} />
    </Box>
  );
};

export default Upload;
