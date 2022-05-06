import {
    Button,
    Flex,
    Image,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo-black.svg'
import { useAuth } from '../context/AuthContext'
import { theme } from '../utils/theme'
import UserAccount from './UserAccount'
const Navbar = () => {
    const { user, signOutUser } = useAuth()!
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isOpenMenu,
        onOpen: onOpenMenu,
        onClose: onCloseMenu,
    } = useDisclosure()
    const navigate = useNavigate()

    useEffect(() => {}, [user])

    const handleUpload = () => {
        if (user) {
            navigate('/upload')
        } else {
            onOpen()
        }
    }

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
                    <Text fontWeight="bold" onClick={handleUpload}>
                        Upload
                    </Text>

                    {!user && (
                        <Button
                        py={5} px={10}
                        size='sm'
                            onClick={() => {
                                onOpen()
                            }}
                            _hover={{
                                opacity: 1,
                            }}
                            // w="150px"
                            bg={theme.colorRed}
                            color={theme.colorWhite}
                        >
                            Log In
                        </Button>
                    )}

                    {user && (
                        <Menu isOpen={isOpenMenu}>
                            <MenuButton onMouseEnter={onOpenMenu}>
                                <Image
                                    src={user?.photoURL}
                                    w="100px"
                                    h="40px"
                                    borderRadius="50%"
                                    objectFit="cover"
                                />
                            </MenuButton>
                            <MenuList onMouseLeave={onCloseMenu}>
                                <MenuItem>Download</MenuItem>
                                <MenuItem>Create a Copy</MenuItem>
                                <MenuItem>Mark as Draft</MenuItem>
                                <MenuItem>Delete</MenuItem>
                                <MenuDivider />
                                <MenuItem onClick={signOutUser}>
                                    Log Out
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                </Flex>
            </Flex>
            <UserAccount isOpen={isOpen} onClose={onClose} />
        </>
    )
}

export default Navbar
