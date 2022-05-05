import {
    Text,
    Heading,
    Box,
    Stack,
    Input,
    InputLeftAddon,
    InputGroup,
    Flex,
} from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../utils/theme'
import { FcGoogle } from 'react-icons/fc'
import { RiUserLine, RiFacebookBoxFill } from 'react-icons/ri'
import { useAuth } from '../context/AuthContext'

const SignUp = () => {
    const styles = {
        padding: 0,
        alignItems: 'center',
        gap: '5px',
        border: '1px solid gray',
        fontSize: '1.5rem',
        height: '100%',
        fontWeight: 'bold',
        iconStyle: {
            fontSize: '2rem',
            p: 4,
            mr: 35,
            borderRight: '1px solid gray',
        },
    }
    const { logInWithGoogle,logInWithFacebook } = useAuth()!
    return (
        <>
            <Stack my={5} spacing="10px">
                {/* <InputGroup>
          <InputLeftAddon children={<RiUserLine/>} />
          <Input type='tel' placeholder='phone number' />
        </InputGroup> */}
                <Flex {...styles}>
                    <Box {...styles.iconStyle}>
                        {' '}
                        <RiUserLine />
                    </Box>
                    <Link to="/loginEmail">
                        {' '}
                        <Text cursor="pointer">Use Email/Password</Text>
                    </Link>
                </Flex>
                <Flex {...styles}>
                    <Box {...styles.iconStyle}>
                        <FcGoogle />
                    </Box>
                    <Text cursor="pointer" onClick={logInWithGoogle}>
                        Continue With Google
                    </Text>
                </Flex>
                <Flex {...styles}>
                    <Box {...styles.iconStyle}>
                        <RiFacebookBoxFill color="#0676E8" />
                    </Box>
                    <Text cursor="pointer" onClick={logInWithFacebook}>Continue With Facebook</Text>
                </Flex>
            </Stack>
            <Link to="/">
                <Text textAlign="center">
                    Already Have Account?,
                    <Text fontWeight="bold" as="span" color={theme.colorRed}>
                        Log In
                    </Text>
                </Text>
            </Link>
        </>
    )
}

export default SignUp
