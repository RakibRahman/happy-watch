import React from 'react';
import {User} from '../../utils/types';
import {Flex, Box, Heading, Image, Text} from '@chakra-ui/react';
import {FaMusic} from 'react-icons/fa';
type Info = {
  user: User;
};
const UserInfo: React.FC<Info> = ({user}) => {
  return (
    <Flex gap={3}>
      <Image src={user.photoURL} w="50px" height="50px" borderRadius="50%" />
      <Flex align="center" gap={1}>
        <Heading size="md">{user.userName}</Heading>
        <Text size="sm">{user.displayName}</Text>
      </Flex>
    </Flex>
  );
};

export default UserInfo;
