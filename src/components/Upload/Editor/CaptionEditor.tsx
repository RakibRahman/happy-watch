import { Box, Button, useToast } from '@chakra-ui/react';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, { MentionData } from '@draft-js-plugins/mention';
import { DraftHandleValue, EditorState, Modifier } from 'draft-js';
import { getDocs } from 'firebase/firestore';
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { insertCharacter } from '../../../lib/draft-utils';
import { fbFireStore } from '../../../lib/firebase';
import editorStyles from './CustomMentionEditor.module.css';
import mentionsStyles from './MentionsStyles.module.css';

type CaptionEditorProps = {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
};

export default function CustomMentionEditor({
  editorState,
  setEditorState,
}: CaptionEditorProps): ReactElement {
  const ref = useRef<Editor>(null);

  let maxLength = 150;

  const toast = useToast();

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionData[]>([]);

  const {MentionSuggestions, plugins} = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      theme: mentionsStyles,
      mentionPrefix: '@',
      supportWhitespace: true,
    });
    // eslint-disable-next-line no-shadow
    const {MentionSuggestions} = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return {plugins, MentionSuggestions};
  }, []);

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);

  const getUsers = async () => {
    let ref = fbFireStore.collection('users');

    const querySnapshot = await getDocs(ref);

    setSuggestions(
      querySnapshot.docs.map(doc => {
        let data = doc.data();

        return {
          id: doc.id,
          name: data.displayName,
          link: `/${data.userName}`,
          avatar: data.photoURL,
        };
      }),
    );
  };

  const onSearchChange = useCallback(() => {
    getUsers();
  }, []);

  function handleBeforeInput(
    chars: string,
    editorState: EditorState,
    eventTimeStamp: number,
  ): DraftHandleValue {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;

    if (currentContentLength > maxLength - 1) {
      console.log(`You can type max ${maxLength} characters`);

      return 'handled';
    }

    return 'not-handled';
  }

  function handlePastedText(
    text: string,
    _: string,
    state: EditorState,
  ): DraftHandleValue {
    const overflowChars =
      text.length + state.getCurrentContent().getPlainText().length - maxLength;

    if (overflowChars > 0) {
      if (text.length - overflowChars > 0) {
        const newContent = Modifier.insertText(
          state.getCurrentContent(),
          state.getSelection(),
          text.substring(0, text.length - overflowChars),
        );
        setEditorState(
          EditorState.push(state, newContent, 'insert-characters'),
        );
      }
      return 'handled';
    } else {
      return 'not-handled';
    }
  }
  const onMention = () => {
    const newEditorState = insertCharacter('@', editorState);
    setEditorState(newEditorState);
  };
  useEffect(() => {}, [editorState]);

  return (
    <>
      <Box
        w="400px"
        h="100px"
        className={editorStyles.editor}
        onClick={() => {
          ref.current!.focus();
        }}
      >
        <Editor
          editorKey={'editor'}
          editorState={editorState}
          onChange={setEditorState}
          plugins={plugins}
          ref={ref}
          handleBeforeInput={handleBeforeInput}
          handlePastedText={handlePastedText}
        />
        <MentionSuggestions
          open={open}
          onOpenChange={onOpenChange}
          suggestions={suggestions}
          onSearchChange={onSearchChange}
          onAddMention={() => {
            // get the mention object selected
          }}
        />
      </Box>
    </>
  );
}
