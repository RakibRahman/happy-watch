import { ReactNode } from 'react'
import { User as FirebaseUser } from 'firebase/auth'

export interface Props {
    children?: ReactNode
}

export type CurrentUser = FirebaseUser | null

export interface AuthContextInterface {
    currentUser: CurrentUser
    error: string
    loading: boolean
    logInWithGoogle: () => void
    signOutUser: () => void
}
