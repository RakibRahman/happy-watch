import React, {
  MouseEvent,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import {EditorState, convertToRaw} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionData,
  MentionPluginTheme,
} from '@draft-js-plugins/mention';
import editorStyles from './CustomMentionEditor.module.css';
import mentionsStyles from './MentionsStyles.module.css';
// import mentions from './Mentions';
import {User} from '../../utils/types';
import {collection, getDocs} from 'firebase/firestore';
import {fbFireStore} from '../../lib/firebase';
import {Box} from '@chakra-ui/react';

export interface EntryComponentProps {
  className?: string;
  onMouseDown(event: MouseEvent): void;
  onMouseUp(event: MouseEvent): void;
  onMouseEnter(event: MouseEvent): void;
  role: string;
  id: string;
  'aria-selected'?: boolean | 'false' | 'true';
  theme?: MentionPluginTheme;
  mention: MentionData;
  isFocused: boolean;
  searchValue?: string;
}

function Entry(props: EntryComponentProps): ReactElement {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <div className={theme?.mentionSuggestionsEntryContainer}>
        <div className={theme?.mentionSuggestionsEntryContainerLeft}>
          <img
            src={mention.avatar}
            className={theme?.mentionSuggestionsEntryAvatar}
            role="presentation"
          />
        </div>

        <div className={theme?.mentionSuggestionsEntryContainerRight}>
          <div className={theme?.mentionSuggestionsEntryText}>
            {mention.userName}
          </div>

          <div className={theme?.mentionSuggestionsEntryTitle}>
            {mention.title}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomMentionEditor(): ReactElement {
  const ref = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
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

  const onSearchChange = useCallback(({value}: {value: string}) => {
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
