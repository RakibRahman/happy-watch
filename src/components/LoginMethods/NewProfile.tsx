import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fbFireStore } from '../../lib/firebase'
import { theme } from '../../utils/theme'

const NewProfile = () => {
    const { currentUser } = useAuth()!
    const [userName, setUserName] = useState<string | undefined>('')
    const [isTaken, setIsTaken] = useState(false)
    const toast = useToast()

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
            const ref = fbFireStore.doc(` usernames/@${userName}`)
            const { exists } = await ref.get()

            setIsTaken(exists)
        }
        if (uNameCondition) {
            checkUserName()
        }
    }, [userName])

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault()
        const { uid, displayName, photoURL } = currentUser!

        if (userName && userName?.length < 3) {
            toast({
                title: 'UserName must be 3 characters long',
                status: 'error',
            })
        } else if (userName && userName?.length > 20) {
            toast({
                title: 'UserName is crossing 20 characters limit',
                status: 'error',
            })
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
                bg={theme.colorRed}
                color={theme.colorWhite}
                type="submit"
            >
                Sign Up
            </Button>
        </Box>
    )
}

export default NewProfile
