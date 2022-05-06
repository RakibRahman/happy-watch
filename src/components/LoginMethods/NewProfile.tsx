import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    useToast,
} from '@chakra-ui/react'
import React, { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fbFireStore } from '../../lib/firebase'
import { theme } from '../../utils/theme'
import { ModalProps } from '../../utils/types'

const NewProfile: FC<ModalProps> = ({ currentUser, onClose }) => {
    // const { currentUser } = useAuth()!
    const [userName, setUserName] = useState<string | undefined>('')
    const [isTaken, setIsTaken] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setUserName(value)
    }

    useEffect(() => {
        if (currentUser) {
            const defaultUserName = currentUser.displayName?.replace(/\s/g, '')
            setUserName(defaultUserName)
        }
    }, [currentUser])

    useEffect(() => {
        const uName = userName?.replace(/\s/g, '')
        const uNameCondition = uName && uName.length >= 3 && uName.length < 20

        const checkUserName = async () => {
            const ref = fbFireStore.doc(`usernames/@${userName}`)
            const { exists } = await ref.get()
            setIsTaken(exists)
        }
        if (uNameCondition) {
            checkUserName()
        }
    }, [userName])

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        const { uid, displayName, photoURL } = currentUser!
        const uName = `@${userName?.replace(/\s/g, '')}`

        if (userName && userName?.length < 3) {
            toast({
                title: 'UserName must be 3 characters long',
                status: 'error',
            })
            return
        } else if (userName && userName?.length > 20) {
            toast({
                title: 'UserName is crossing 20 characters limit',
                status: 'error',
            })
            return
        }
        try {
            setLoading(true)
            await fbFireStore.doc(`users/${uid}`).set({
                userName: uName,
                uid,
                photoURL: photoURL
                    ? photoURL
                    : `https://picsum.photos/200/300/?blur`,
                displayName: displayName ? displayName : uName,
            })
            await fbFireStore.doc(`usernames/${uName}`).set({ uid })
            navigate('/')
            onClose()
            toast({
                title: 'Account successfully created',
                status: 'success',
            })
        } catch (error) {
            toast({
                title: JSON.stringify(error),
                status: 'error',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box as="form" onSubmit={submitHandler}>
            <FormControl>
                <FormLabel>Create User Name</FormLabel>
                <Input
                    name="name"
                    value={userName}
                    onChange={onChangeHandler}
                    placeholder="Select Display Name"
                />
                <Text my={4} color={theme.colorRed}>
                    {isTaken ? 'User Name is already taken' : ''}
                </Text>
            </FormControl>
            <Button
                disabled={isTaken}
                isLoading={loading}
                loadingText="Signing up..."
                bg={theme.colorRed}
                color={theme.colorWhite}
                type="submit"
                _hover={{
                    // bg:'none',
                    opacity: 1,
                }}
            >
                Sign Up
            </Button>
        </Box>
    )
}

export default NewProfile
