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
} from '@chakra-ui/react';
import React, {useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import LogoBlack from '../assets/logo-black.svg';
import LogoWhite from '../assets/logo-white.svg';
import {useAuth} from '../context/AuthContext';
import {theme} from '../utils/theme';
import UserAccount from './UserAccount';
import {HiOutlineLogout, HiOutlineCloudUpload} from 'react-icons/hi';
const Navbar = () => {
  const {user, signOutUser} = useAuth()!;
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {
    isOpen: isOpenMenu,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  } = useDisclosure();
  const navigate = useNavigate();

  useEffect(() => {}, [user]);

  const handleUpload = () => {
    if (user) {
      navigate('/upload');
    } else {
      onOpen();
    }
  };

  return (
    <>
      <Flex
        borderBottom="1px solid gray"
        justify="space-around"
        align="center"
        gap={10}
        px="15%"
        py={5}
        // bg={theme.colorDarkSienna}
        color={theme.colorWhite}
      >
        <Link to="/">
          <Image src={LogoBlack} w="300px" height="auto" alt="Brand logo" />
        </Link>
        <Input type="text" placeholder="Search Videos..." />
        <Flex justify="space-between" align="center" gap={3} cursor="pointer">
          <Text fontWeight="bold" onClick={handleUpload}>
            {user ? (
              <HiOutlineCloudUpload color="black" fontSize="2rem" />
            ) : (
              'Upload'
            )}
          </Text>

          {!user && (
            <Button
              py={5}
              px={10}
              size="sm"
              onClick={() => {
                onOpen();
              }}
              _hover={{
                opacity: 1,
              }}
              bg={theme.colorRed}
              color={theme.colorWhite}
            >
              Log In
            </Button>
          )}

          {user && (
            <Menu isOpen={isOpenMenu}>
              <MenuButton onClick={onCloseMenu} onMouseEnter={onOpenMenu}>
                <Image
                  src={user?.photoURL}
                  w="70px"
                  borderRadius="50%"
                  objectFit="cover"
                />
              </MenuButton>
              <MenuList bg={theme.colorBlack} onMouseLeave={onCloseMenu}>
                <MenuItem _hover={{bg: 'transparent'}}>Profile</MenuItem>
                <MenuItem _hover={{bg: 'transparent'}}>Settings</MenuItem>
                <MenuDivider />
                <MenuItem _hover={{bg: 'transparent'}} onClick={signOutUser}>
                  <Flex align="center" gap={1}>
                    <HiOutlineLogout fontSize="1.5rem" />
                    <Text>Log Out</Text>
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Flex>
      <UserAccount isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Navbar;
