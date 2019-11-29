import { useContext } from 'react';
import AppContext from '../utils/AppContext';

const useAppContext = () => {
  const { authUser, newContact, setNewContact } = useContext(AppContext);

  return {
    authUser,
    newContact,
    setNewContact
  };
};

export default useAppContext;
