import { useState } from 'react';

type Hook = (defaultValue?: boolean) => any;

const useBoolean: Hook = (defaultValue = false) => {
  const [isTrue, setBooleanValue] = useState(defaultValue);
  const setToTrue = () => setBooleanValue(true);
  const setToFalse = () => setBooleanValue(false);

  return [isTrue, setToTrue, setToFalse];
};

export default useBoolean;
