import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { Spinner } from './src/common';
import useBoolean from './src/hooks/useBoolean';
import Main from './src/Main';

const App = () => {
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [loading, startLoading, stopLoading] = useBoolean(false);

  useEffect(() => {
    getStoredToken();
  }, []);

  useEffect(() => {
    // OneSignal.init('3202b90a-81b5-4d06-9e51-c20c4417907d', {
    //   kOSSettingsKeyInFocusDisplayOption: 2
    // });
    // requestNotificationPermissions();

    SplashScreen.hide();
  });

  // const requestNotificationPermissions = async () => {
  //   if (Platform.OS === 'ios') {
  //     const permissions = {
  //       alert: true,
  //       badge: true,
  //       sound: true
  //     };
  //     OneSignal.requestPermissions(permissions);
  //   }
  // };

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
