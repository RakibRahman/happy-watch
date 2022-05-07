
import ErrorIcon from '../assets/404.png';
import {Flex,Text,Image} from '@chakra-ui/react'; 
const Notfound = () => {
    return (
        
          <Flex mt={10} justify="center" align="center" flexDirection="column">
           <Image w='300px' h='300px' objectFit='cover' src={ErrorIcon} alt="Error"/>
            <Text fontSize="2rem" >It's Empty Here</Text>
            <Text>
              Sorry about that! Please try again later.
            </Text>
          </Flex>
       
      );
}

export default Notfound;