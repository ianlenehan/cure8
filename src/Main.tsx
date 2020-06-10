import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Root } from 'native-base';
import { ApolloProvider } from 'react-apollo';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';

import AppContext from './utils/AppContext';
import RootTab from './navigation/RootTab';
import CompleteSignUpScreen from './auth/CompleteSignUpScreen';

const Main = (props: any) => {
  const { apolloClient, authUser, setAuthUser, showSignupScreen } = props;

  const [newContact, setNewContact] = useState({
    familyName: '',
    givenName: '',
    phoneNumbers: []
  });
  const [selectedConversationId, setSelectedConversationId] = useState('');
  const [currentPushId, setCurrentPushId] = useState('');
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: '',
    pushToken: ''
  });

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

  if (!apolloClient) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Root>
        <AppContext.Provider
          value={{
            authUser,
            setAuthUser,
            currentUser,
            setCurrentUser,
            newContact,
            setNewContact,
            selectedConversationId,
            setSelectedConversationId
          }}>
          <StatusBar barStyle="light-content" />
          <View style={styles.container}>
            {showSignupScreen ? (
              <CompleteSignUpScreen />
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
