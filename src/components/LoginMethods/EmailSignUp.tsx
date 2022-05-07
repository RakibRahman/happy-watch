import { Box, Button, Input, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { theme } from '../../utils/theme'
import { FormState } from '../../utils/types'

const EmailSignUp = () => {
    const [formState, setFormState] = useState<FormState>({
        email: '',
        password: '',
        repeatPassword: '',
    })

    const { accountWithEmail, loading } = useAuth()!
    const toast = useToast()

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const name = e.target.name
        setFormState({ ...formState, [name]: value })
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault()

        if (!formState) return
        if (formState.password !== formState.repeatPassword) {
            toast({
                title: 'Password does not match',
                status: 'error',
            })
            return
        }
        accountWithEmail(formState.email, formState.password)
    }

    return (
        <Box>
            <Text>Sign Up</Text>
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
                <Input
                    required
                    onChange={onChangeHandler}
                    value={formState.repeatPassword}
                    type="password"
                    placeholder="Repeat Password"
                    name="repeatPassword"
                />
                <Button
                    loadingText="Signing Up..."
                    isLoading={loading}
                    disabled={loading}
                    type="submit"
                    color={theme.colorWhite}
                    bg={theme.colorRed}
                >
                    SignUp
                </Button>
            </Stack>
            <Link to="/">
                <Text>Already have account?,Log in...</Text>
            </Link>
        </Box>
    )
}

export default EmailSignUp
