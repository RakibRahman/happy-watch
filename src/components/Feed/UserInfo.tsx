import React from 'react';
import { User } from '../../utils/types';
import { Flex, Box, Heading, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

type Info = {
  user: User;
};
const UserInfo: React.FC<Info> = ({ user }) => {
  return (
    <Link to={`/${user.userName}`}>
      <Flex gap={3} w='100%' mb={3} align="center">
        <Flex w='100%' ml='auto' align="center" gap="15px">
          <Heading size="lg" _hover={{
            textDecoration: 'underline'
          }}>{user.userName}</Heading>
          <Text fontSize="1.2rem" >{user.displayName}</Text>
        </Flex>
      </Flex>
    </Link>
  );
};

export default UserInfo;
