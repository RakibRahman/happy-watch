import {Box, Flex} from '@chakra-ui/react';
import React from 'react';
import {formatDraftText} from '../../lib/draft-utils';
type Props = {
  content: any;
};

const FeedPost: React.FC<Props> = ({content}) => {
  console.log(formatDraftText(content));
  return (
    <>
      <Box dangerouslySetInnerHTML={{__html: formatDraftText(content)}} />
      <Flex>
        <Box></Box>
      </Flex>
    </>
  );
};

export default FeedPost;
