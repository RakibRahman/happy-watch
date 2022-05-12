import {Box, Flex, Heading, Stack, Text} from '@chakra-ui/react';
import React from 'react';
import {FcGoogle} from 'react-icons/fc';
import {RiUserLine} from 'react-icons/ri';
import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {theme} from '../utils/theme';

const LogIn: React.FC = () => {
  const styles = {
    padding: 0,
    alignItems: 'center',
    gap: '5px',
    border: '1px solid gray',
    fontSize: '1.5rem',
    height: '100%',
    fontWeight: 'bold',
    iconstyle: {
      fontSize: '2rem',
      p: 4,
      mr: 35,
      borderRight: '1px solid gray',
    },
  };
  const {logInWithGoogle, loading} = useAuth()!;
  return (
    <Box textAlign="center">
      <Heading size="lg">Log In To HappyWatch</Heading>
      <Stack my={5} spacing="10px">
        {/* <InputGroup>
          <InputLeftAddon children={<RiUserLine/>} />
          <Input type='tel' placeholder='phone number' />
        </InputGroup> */}
        <Flex {...styles}>
          <Box {...styles.iconstyle}>
            {' '}
            <RiUserLine />
          </Box>
          <Link to="/loginEmail">
            {' '}
            <Text cursor="pointer">Use Email/Password</Text>
          </Link>
        </Flex>
        <Flex {...styles}>
          <Box {...styles.iconstyle}>
            <FcGoogle />
          </Box>
          <Text cursor="pointer" onClick={logInWithGoogle}>
            Continue With Google
          </Text>
        </Flex>
        {/* <Flex {...styles}>
                    <Box {...styles.iconstyle}>
                        <RiFacebookBoxFill color="#0676E8" />
                    </Box>
                    <Text cursor="pointer" onClick={logInWithFacebook}>Continue With Facebook</Text>
                </Flex> */}
      </Stack>
      <Link to="/signup">
        <Text>
          Does not have any account yet?{' '}
          <Text fontWeight="bold" as="span" color={theme.colorRed}>
            Sign Up
          </Text>
        </Text>
      </Link>
    </Box>
  );
};

export default LogIn;
