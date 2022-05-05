import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Text, Box, Stack, Input, Button } from '@chakra-ui/react'
import { theme } from '../../utils/theme'
import { useAuth } from '../../context/AuthContext'

interface FormState {
    email: string
    password: string
}
const EmailLogIn = () => {
    const [formState, setFormState] = useState<FormState>({
        email: '',
        password: '',
    })

    const { logInWithEmail } = useAuth()!

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const name = e.target.name

        setFormState({ ...formState, [name]: value })
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formState) return

        logInWithEmail(formState.email, formState.password)
    }

    return (
        <Box>
            <Text>Log In</Text>
            <Stack as="form" spacing="10px" onSubmit={submitHandler}>
                <Input
                    required
                    onChange={onChangeHandler}
                    value={formState.email}
                    type="email"
                    placeholder="Enter Email"
                    name="email"
                />
                <Input
                    required
                    onChange={onChangeHandler}
                    value={formState.password}
                    type="password"
                    placeholder="Password"
                    name="password"
                />

                <Button
                    _hover={{ opacity: 1 }}
                    type="submit"
                    color={theme.colorWhite}
                    bg={theme.colorRed}
                >
                    LogIn
                </Button>
            </Stack>
            <Link to="/signup">
                <Text>Need Account?,Sign Up</Text>
            </Link>
        </Box>
    )
}

export default EmailLogIn
