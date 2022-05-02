import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,

} from '@chakra-ui/react'
import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
interface ModalProps {
    isOpen: boolean
    onClose: () => void
}
import LogIn from './LogIn'
import SignUp from './SignUp'
import { Route, Routes } from 'react-router-dom'
import Email from './LoginMethods/Email';
import { BiChevronLeft } from "react-icons/bi";

const UserAccount: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        
    }, [location]);

    return (
        <>


            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{location.pathname === '/loginEmail' && <Button size='xs' onClick={() => navigate(-1)} bg='none' _hover={{bg:'none'}}> <BiChevronLeft fontSize='2rem' /></Button>}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Routes>
                            <Route path="/" element={<LogIn />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/loginEmail" element={<Email />} />
                        </Routes>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UserAccount
