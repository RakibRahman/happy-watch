import React, { useEffect } from 'react'
import {
    Button,
    Flex,
    Text,
    Image,
    Input,
    useDisclosure,
} from '@chakra-ui/react'
import Logo from '../assets/logo-black.svg'
import { theme } from '../utils/theme'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import UserAccount from './UserAccount'
const Navbar = () => {
    const {  signOutUser,user } = useAuth()!
    const { isOpen, onOpen, onClose } = useDisclosure()
useEffect(()=>{
console.log(user)
},[user])
    return (
        <>
            <Flex
                borderBottom="1px solid gray"
                justify="space-around"
                align="center"
                gap={10}
                px={50}
                py={5}
            >
                <Link to="/">
                    <Image
                        src={Logo}
                        w="300px"
                        height="auto"
                        alt="Brand logo"
                    />
                </Link>
                <Input type="text" placeholder="Search Videos..." />
                <Flex
                    justify="space-between"
                    align="center"
                    gap={3}
                    cursor="pointer"
                >
                    <Text fontWeight="bold">Upload</Text>

                    {!user && (
                        <Button
                            onClick={() => {
                                onOpen()
                                console.log('first')
                            }}
                            _hover={{
                                opacity: 1,
                            }}
                            w="150px"
                            bg={theme.colorRed}
                            color={theme.colorWhite}
                        >
                            Log In
                        </Button>
                    )}
                    {user && (
                        <Button
                            onClick={signOutUser}
                            _hover={{
                                opacity: 1,
                            }}
                            w="150px"
                            bg={theme.colorRed}
                            color={theme.colorWhite}
                        >
                            Sign Out
                        </Button>
                    )}
                    {user && <Image src={user?.photoURL} w='30px' h='30px' objectFit='cover' />}
                    <Text>{user ? user.userName : ''}</Text>

                </Flex>
            </Flex>
            <UserAccount isOpen={isOpen} onClose={onClose} />
        </>
    )
}

export default Navbar
