import { Text } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import { theme } from '../utils/theme'

const SignUp = () => {
    return (
        <>
            signup
            <Link to="/">
                <Text>Log in...</Text>
            </Link>
        </>
    )
}

export default SignUp
