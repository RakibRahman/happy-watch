import {useToast} from '@chakra-ui/react';

type StatusProps = 'success' | 'error' | 'warning' | 'info';

const useToaster = (
  title: string,
  status: StatusProps = 'success',
  description: string,
  id?: string,
) => {
  const toast = useToast({
    id,
    title,
    description,
    status,
    duration: 3000,
    isClosable: true,
    position: 'bottom',
    variant: 'solid',
  });

  return {toast};
};

export default useToaster;
