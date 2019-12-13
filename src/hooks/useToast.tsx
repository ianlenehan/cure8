import { Toast } from 'native-base';

const useToast = (message: string, type?: 'success' | 'warning' | 'danger') => {
  return Toast.show({
    text: message,
    position: 'top',
    buttonText: 'OK',
    duration: 3000,
    type
  });
};

export default useToast;
