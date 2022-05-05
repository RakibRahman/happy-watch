import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'
import React from 'react'
import { BiChevronLeft } from 'react-icons/bi'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LogIn from './LogIn'
import Email from './LoginMethods/Email'
import NewProfile from './LoginMethods/NewProfile'
import SignUp from './SignUp'
interface ModalProps {
    isOpen: boolean
    onClose: () => void
}

const UserAccount: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { currentUser,user } = useAuth()!

    React.useEffect(() => {
        if(user){
            onClose();
            // navigate('/');
        }
    }, [location,user])

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {location.pathname === '/loginEmail' && (
                            <Button
                                size="xs"
                                onClick={() => navigate(-1)}
                                bg="none"
                                _hover={{ bg: 'none' }}
                            >
                                {' '}
                                <BiChevronLeft fontSize="2rem" />
                            </Button>
                        )}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Routes>
                            <Route path="/" element={<LogIn />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/loginEmail" element={<Email />} />
                            <Route
                                path="/new-profile"
                                element={<NewProfile currentUser={currentUser} onClose={onClose} />}
                            />
                        </Routes>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserAccount
