import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import { Spinner } from './src/common';
import useBoolean from './src/hooks/useBoolean';
import Main from './src/Main';

const App = () => {
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [loading, startLoading, stopLoading] = useBoolean(false);

  useEffect(() => {
    getStoredToken();
  }, []);

  const getStoredToken = async () => {
    startLoading();
    const token = await AsyncStorage.getItem('@auth_token');
    setStoredToken(token);
    stopLoading();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@auth_token');
    setStoredToken(null);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <NavigationContainer>
      <Main
        {...{ storedToken }}
        setToken={setStoredToken}
        logout={handleLogout}
      />
    </NavigationContainer>
  );
};

export default App;
