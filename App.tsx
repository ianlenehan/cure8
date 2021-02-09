import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

import Main from './src/Main';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <NavigationContainer>
      <RecoilRoot>
        <Main />
      </RecoilRoot>
    </NavigationContainer>
  );
};

export default App;
