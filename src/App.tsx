import { ChakraProvider } from '@chakra-ui/react'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import LogIn from './components/LogIn'
import Navbar from './components/Navbar'
import SignUp from './components/SignUp'
import Upload from './components/Upload'
import { AuthContextProvider, useAuth } from './context/AuthContext'

function App() {
    const { currentUser } = useAuth()!

    return (
        <ChakraProvider>
            <AuthContextProvider>
                <Navbar />
                <Routes>
                    {/* <Route path="/login" element={<LogIn />} />
                    <Route path="/signup" element={<SignUp />} /> */}
                    <Route path="/upload" element={<Upload />} />
                </Routes>
                <Footer />
            </AuthContextProvider>
        </ChakraProvider>
    )
}

export default App
