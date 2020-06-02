import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import firebase, { RNFirebase } from 'react-native-firebase';
import { Root } from 'native-base';
import ApolloClient from 'apollo-boost/lib/index';
import { ApolloProvider } from 'react-apollo';
import { NavigationContainer } from '@react-navigation/native';

import Main from './src/Main';
import RootTab from './src/navigation/RootTab';
import LoginScreen from './src/auth/LoginScreen';

import { Spinner } from './src/common';

const rootURL = 'http://localhost:3001/';

const getApolloClient = (token: string) => {
  return new ApolloClient({
    uri: `${rootURL}graphql`,
    headers: { token }
  });
};

const App = () => {
  const [authUser, setAuthUser] = useState<RNFirebase.User>();
  const [newContact, setNewContact] = useState({});
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
          newContact,
          setNewContact,
          showSignupScreen
        }}
      />
    );
  };

  if (loading) return <Spinner />;

  return <NavigationContainer>{renderApp()}</NavigationContainer>;
};

export default App;
