import {ChakraProvider} from '@chakra-ui/react';
import {Route, Routes} from 'react-router-dom';
import Feed from './components/Feed';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Upload from './components/Upload/Upload';
import VideoPost from './components/VideoPost';
import {AuthContextProvider, useAuth} from './context/AuthContext';
import Notfound from './pages/Notfound';
function App() {
  const {currentUser} = useAuth()!;

  return (
    <ChakraProvider>
      <AuthContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/:username/video/:postId" element={<VideoPost />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
        <Footer />
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
