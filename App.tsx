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

const rootURL = 'http://localhost:3000/';

const MainApp = createAppContainer(RootNavigator);

const App = () => {
  const [authUser, setAuthUser] = useState<RNFirebase.User>();
  const [newContact, setNewContact] = useState({});
  const [apolloClient, setApolloClient] = useState();

  useEffect(() => {
    const unsubscriber = firebase
      .auth()
      .onAuthStateChanged(async userFromAuth => {
        if (userFromAuth) {
          setAuthUser(userFromAuth);
        } else {
          console.log('no user');
        }
      });

    return () => unsubscriber();
  }, []);

  useEffect(() => {
    if (authUser) {
      getIdToken(authUser);
    }
  }, [authUser]);

  const getIdToken = async (authUser: RNFirebase.User) => {
    try {
      const token = await authUser.getIdToken(true);
      const client = new ApolloClient({
        uri: `${rootURL}graphql`,
        headers: { token }
      });
      setApolloClient(client);
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

  if (!apolloClient) return <Spinner />;

  return (
    <ApolloProvider client={apolloClient}>
      <Root>
        <AppContext.Provider value={{ authUser, newContact, setNewContact }}>
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
