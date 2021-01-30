import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View, Text } from 'react-native';
import { Root } from 'native-base';
import auth from '@react-native-firebase/auth';
import { ApolloProvider } from '@apollo/client';
import AsyncStorage from '@react-native-community/async-storage';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import OneSignal from 'react-native-onesignal';

import AppContext from './utils/AppContext';
import RootTab from './navigation/RootTab';
import CompleteSignUpScreen from './auth/CompleteSignUpScreen';
import LoginScreen from './auth/LoginScreen';
import { rootURL } from '../env';

type Props = {
  storedToken: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
};

type User = {
  id: string;
  phone: string;
};

const Main = ({ logout, storedToken, setToken }: Props) => {
  const [apolloClient, setApolloClient] = useState<any>();
  const [registrationRequired, setRegistrationRequired] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [newContact, setNewContact] = useState({
    familyName: '',
    givenName: '',
    phoneNumbers: []
  });
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [currentPushId, setCurrentPushId] = useState('');

  useEffect(() => {
    OneSignal.getPermissionSubscriptionState((status: any) => {
      checkNotificationStatus(status);
    });

    OneSignal.addEventListener('received', handleReceived);
    OneSignal.addEventListener('opened', handleOpened);
    OneSignal.addEventListener('ids', handleIds);

    return () => {
      OneSignal.removeEventListener('received', handleReceived);
      OneSignal.removeEventListener('opened', handleOpened);
      OneSignal.removeEventListener('ids', handleIds);
    };
  }, []);

  const handleReceived = (event: any) => {
    console.log('received', event);
  };
  const handleOpened = () => {};
  const handleIds = () => {};

  const checkNotificationStatus = async (status: any) => {
    setCurrentPushId(status.userId);
  };

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      // logout();
    }
  });

  const httpLink = createHttpLink({
    uri: `${rootURL}graphql`
  });

  const authLink = setContext(() => ({
    headers: { Authorization: `Basic ${storedToken}` }
  }));

  useEffect(() => {
    if (storedToken) {
      setTokenInAsyncStorage();
      signIntoFirebase()
      const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: errorLink.concat(authLink.concat(httpLink))
      });

      setApolloClient(client);
    }
  }, [storedToken]);

  const signIntoFirebase = async () => {
    try {
      const user = auth().currentUser;

      if (!user) {
        await auth().signInWithCustomToken(storedToken || '')
      }
    } catch (error) {
      // TODO request new token if necessary
      console.log({error})
    }
    
  }

  const handleUserUpdateComplete = () => {
    setRegistrationRequired(false)
  }

  const setTokenInAsyncStorage = async () => {
    if (storedToken) {
      await AsyncStorage.setItem('@auth_token', storedToken);
    }
  };

  if (!storedToken) {
    return (
      <LoginScreen
        {...{
          registrationRequired,
          setRegistrationRequired,
          setCurrentUser,
          setToken
        }}
      />
    );
  }

  if (!apolloClient) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Root>
        <AppContext.Provider
          value={{
            currentPushId,
            logout,
            newContact,
            setNewContact,
            selectedConversationId,
            setSelectedConversationId,
            setCurrentUser
          }}>
          <StatusBar barStyle="light-content" />
          <View style={styles.container}>
            {registrationRequired ? (
              <CompleteSignUpScreen onUpdate={handleUserUpdateComplete} phone={currentUser?.phone} />
            ) : (
              <RootTab {...{ currentPushId }} />
            )}
          </View>
        </AppContext.Provider>
      </Root>
    </ApolloProvider>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    flex: 1
  }
});
