import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import firebase, { RNFirebase } from 'react-native-firebase';
import ApolloClient from 'apollo-boost/lib/index';
import { NavigationContainer } from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
import SplashScreen from 'react-native-splash-screen';

import Main from './src/Main';
import LoginScreen from './src/auth/LoginScreen';

import { Spinner } from './src/common';

// export const rootURL = 'http://localhost:3001/';
export const rootURL = 'https://cure8.herokuapp.com/';

const getApolloClient = (token: string) => {
  return new ApolloClient({
    uri: `${rootURL}graphql`,
    headers: { token }
  });
};

const App = () => {
  const [authUser, setAuthUser] = useState<RNFirebase.User>();
  const [apolloClient, setApolloClient] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscriber = firebase
      .auth()
      .onAuthStateChanged(async userFromAuth => {
        if (userFromAuth) {
          setAuthUser(userFromAuth);
          getIdToken(userFromAuth);
        } else {
          console.log('no user');
          setAuthUser(undefined);
          setLoading(false);
        }
      });

    return () => unsubscriber();
  }, []);

  useEffect(() => {
    OneSignal.init('3202b90a-81b5-4d06-9e51-c20c4417907d', {
      kOSSettingsKeyInFocusDisplayOption: 2
    });
    requestNotificationPermissions();

    SplashScreen.hide();
  }, []);

  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'ios') {
      const permissions = {
        alert: true,
        badge: true,
        sound: true
      };
      OneSignal.requestPermissions(permissions);
    }
  };

  const getIdToken = async (authUser: RNFirebase.User) => {
    try {
      const token = await authUser.getIdToken(true);
      const client = getApolloClient(token);
      setApolloClient(client);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching token', error);
    }
  };

  const renderApp = () => {
    if (!authUser) {
      return <LoginScreen />;
    }

    const showSignupScreen = authUser.uid && !authUser.displayName;

    return (
      <Main
        {...{
          apolloClient,
          authUser,
          setAuthUser,
          showSignupScreen
        }}
      />
    );
  };

  if (loading) return <Spinner />;

  return <NavigationContainer>{renderApp()}</NavigationContainer>;
};

export default App;
