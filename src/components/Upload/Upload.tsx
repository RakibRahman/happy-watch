import React, {useEffect, useState} from 'react';
import FileUpload from './FileUpload';
import {Box, Text, Flex, Button} from '@chakra-ui/react';
import {useAuth} from '../../context/AuthContext';
import useFireBaseUpload from '../../hooks/useFirebaseUpload';
import CaptionEditor from './Editor/CaptionEditor';
import {theme} from '../../utils/theme';
// import { EditorState } from 'draft-js';
import {EditorState, convertToRaw} from 'draft-js';
import {doc, setDoc} from 'firebase/firestore';
import {fbFireStore, fbTimestamp} from '../../lib/firebase';
import {nanoid} from 'nanoid';
const Upload = () => {
  const {user} = useAuth()!;
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [editorContentLength, setEditorContentLength] = useState(0);
  const [rawContent, setRawContent] = useState<unknown>();
  const {handleUpload, state, dispatch, cancelUpload, discardUpload} =
    useFireBaseUpload(user);

  useEffect(() => {}, [user, state]);

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const characterLength = contentState.getPlainText().length;
    setEditorContentLength(characterLength);
    const raw = convertToRaw(contentState);
    setRawContent(raw);
  }, [editorState]);

  const postVideoData = async () => {
    if (editorContentLength === 0) {
      alert('caption is empty');
      return;
    }
    const postId = nanoid(10);
    if (state.downloadURL) {
      await setDoc(doc(fbFireStore, 'users', `${user.uid}`, 'posts', postId), {
        postId,
        content: rawContent,
        videoUrl: state.downloadURL,
        user,
        audio_name: `original sound - ${user.userName}`,
        timestamp: fbTimestamp,
      });
    } else {
      ('no video data available');
    }
    console.log(postId);
  };
  const discardPostData = async () => {
    if (editorContentLength && state.downloadURL) {
      setEditorState(() => EditorState.createEmpty());
      discardUpload();
      dispatch({type: 'cancelUpload'});

      console.log('editor cleared');
    }
  };
  return (
    <Box px={20}>
      ``
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
        <Flex flexDirection="column">
          <Text ml="auto">
            {editorContentLength}/{150}
          </Text>
          <CaptionEditor
            editorState={editorState}
            setEditorState={setEditorState}
          />
        </Flex>
      </Flex>
      <Flex justify="flex-end" gap={5}>
        <Button onClick={discardPostData} colorScheme="gray" variant="outline">
          Discard
        </Button>
        <Button onClick={postVideoData} colorScheme="green" variant="outline">
          Post
        </Button>
      </Flex>
    </Box>
  );
};

export default Upload;
