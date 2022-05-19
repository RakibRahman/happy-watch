import React, {useEffect, useState} from 'react';
import FileUpload from './FileUpload';
import {Box, Text, Flex, Button} from '@chakra-ui/react';
import {useAuth} from '../../context/AuthContext';
import useFireBaseUpload from '../../hooks/useFirebaseUpload';
import CaptionEditor from './CaptionEditor';
import {theme} from '../../utils/theme';
// import { EditorState } from 'draft-js';

const Upload = () => {
  const {user} = useAuth()!;
  const {handleUpload, state, dispatch, cancelUpload, discardUpload} =
    useFireBaseUpload(user);

  useEffect(() => {}, [user, state]);
  return (
    <Box px={20}>
      <Text> Upload video</Text>
      <Text>Post a video to {user && user.userName}</Text>
      <Flex justify="space-between" gap={20}>
        <FileUpload
          user={user}
          handleUpload={handleUpload}
          state={state}
          cancelUpload={cancelUpload}
          discardUpload={discardUpload}
          dispatch={dispatch}
        />
        <CaptionEditor />
      </Flex>
      <Flex justify="flex-end" gap={5}>
        <Button colorScheme="gray" variant="outline">
          Discard
        </Button>
        <Button colorScheme="green" variant="outline">
          Post
        </Button>
      </Flex>
    </Box>
  );
};

export default Upload;
