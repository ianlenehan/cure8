import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import firebase, { RNFirebase } from 'react-native-firebase';
import('react-native-firebase');
import { Root } from 'native-base';
import ApolloClient from 'apollo-boost/lib/index';
import { ApolloProvider } from 'react-apollo';
import { createAppContainer } from 'react-navigation';
import RootNavigator from './src/navigation/RootNavigator';
import LoginScreen from './src/auth/LoginScreen';
import CompleteSignUpScreen from './src/auth/CompleteSignUpScreen';
import AppContext from './src/utils/AppContext';
import { Spinner } from './src/common';

const rootURL = 'http://localhost:3001/';

const MainApp = createAppContainer(RootNavigator);

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
    if (authUser.uid && !authUser.displayName) {
      return <CompleteSignUpScreen />;
    }
    return <MainApp />;
  };

  if (loading) return <Spinner />;

  return (
    <ApolloProvider client={apolloClient}>
      <Root>
        <AppContext.Provider
          value={{ authUser, setAuthUser, newContact, setNewContact }}>
          <StatusBar barStyle="light-content" />
          <View style={styles.container}>{renderApp()}</View>
        </AppContext.Provider>
      </Root>
    </ApolloProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    flex: 1
  }
});
