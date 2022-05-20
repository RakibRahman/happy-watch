import { Box } from '@chakra-ui/react';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
  MentionData
} from '@draft-js-plugins/mention';
import { convertToRaw, DraftHandleValue, EditorState, Modifier } from 'draft-js';
import { collection, getDocs } from 'firebase/firestore';
import React, {
  ReactElement,
  useCallback, useEffect, useMemo,
  useRef,
  useState
} from 'react';
import { fbFireStore } from '../../../lib/firebase';
import editorStyles from './CustomMentionEditor.module.css';
import mentionsStyles from './MentionsStyles.module.css';


type CaptionEditorProps = {
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
}

export default function CustomMentionEditor({ editorState, setEditorState }: CaptionEditorProps): ReactElement {
  const ref = useRef<Editor>(null);
  // const [editorState, setEditorState] = useState(() =>
  //   EditorState.createEmpty(),
  // );
  let maxLength = 150;

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionData[]>([]);

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'IMMUTABLE',
      theme: mentionsStyles,
      mentionPrefix: '@',
      supportWhitespace: true,
    });
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;
    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin];
    return { plugins, MentionSuggestions };
  }, []);

  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);

  const getUsers = async () => {
    let ref = fbFireStore.collection('users');

    const querySnapshot = await getDocs(collection(fbFireStore, 'users'));

    // querySnapshot.forEach((doc) => {
    //     // doc.data() is never undefined for query doc snapshots
    //     console.log(doc.id, " => ", doc.data());
    //     // setUsers([...users,key: {doc.data()}]);
    // });
    // const data = await getDocs(ref);
    // setUsers(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setSuggestions(
      querySnapshot.docs.map(doc => {
        let data = doc.data();

        return {
          id: doc.id,
          name: data.displayName,
          link: data.uid,
          avatar: data.photoURL,
        };
      }),
    );
  };

  const onSearchChange = useCallback(({ value }: { value: string }) => {
    // An import statment would break server-side rendering.
    // require('whatwg-fetch'); // eslint-disable-line global-require

    // while you normally would have a dynamic server that takes the value as
    // a workaround we use this workaround to show different results
    let url = '/data/mentionsA.json';
    if (value.length === 1) {
      url = '/data/mentionsB.json';
    } else if (value.length > 1) {
      url = '/data/mentionsC.json';
    }

    getUsers();
  }, []);

  const getRawContent = () => {
    console.log(editorState.getCurrentContent());
  };

  function handleBeforeInput(chars: string,
    editorState: EditorState,
    eventTimeStamp: number,): DraftHandleValue {
    const currentContent = editorState.getCurrentContent();
    const currentContentLength = currentContent.getPlainText('').length;


    if (currentContentLength > maxLength - 1) {
      console.log(`You can type max ${maxLength} characters`);

      return "handled";
    }

    return "not-handled";
  }

  function handlePastedText(text: string, _: string, state: EditorState): DraftHandleValue {
    const overflowChars = text.length + state.getCurrentContent().getPlainText().length - maxLength;

    if (overflowChars > 0) {
      if (text.length - overflowChars > 0) {
        const newContent = Modifier.insertText(
          state.getCurrentContent(),
          state.getSelection(),
          text.substring(0, text.length - overflowChars)
        );
        setEditorState(EditorState.push(state, newContent, 'insert-characters'));
      }
      return 'handled';
    } else {
      return 'not-handled';
    }
  }

  useEffect(() => {
    const contentState = editorState.getCurrentContent();
    const characterLength = contentState.getPlainText().length;
    const raw = convertToRaw(contentState);
    // console.log(raw)
  }, [editorState]);

  return (
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
  );
}
