import { useContext } from 'react';
import AppContext from '../utils/AppContext';

const useAppContext = () => {
  const context = useContext(AppContext);

  return context;
};

export default useAppContext;
