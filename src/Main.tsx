import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Root } from 'native-base';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import useCurrentUser from '@cure8/hooks/useCurrentUser';
import useBoolean from '@cure8/hooks/useBoolean';
import { Spinner } from '@cure8/common';

import AppContext from './utils/AppContext';
import RootTab from './navigation/RootTab';
import CompleteSignUpScreen from './auth/CompleteSignUpScreen';
import LoginScreen from './auth/LoginScreen';

const Main = () => {
  const [isRegistrationRequired, setRegistrationRequired, setRegistrationComplete] = useBoolean(false);
  const [loading, startLoading, stopLoading] = useBoolean(true);
  console.log('🚀 ~ file: Main.tsx ~ line 19 ~ Main ~ loading', loading);
  const [currentUser, setCurrentUser] = useCurrentUser();
  const [newContact, setNewContact] = useState({
    familyName: '',
    givenName: '',
    phoneNumbers: [],
  });
  const [selectedConversationId, setSelectedConversationId] = useState('');

  const handleAuthStateChange = () => {
    auth().onAuthStateChanged(async (user: any) => {
      if (user) {
        const document = await firestore().collection('users').doc(user.uid).get();
        const userData = document.data();
        console.log('🚀 ~ file: Main.tsx ~ line 37 ~ .then ~ userData', userData);
        setCurrentUser({ ...userData, id: document.id });
        stopLoading();
      } else {
        stopLoading();
      }
    });
  };

  useEffect(() => {
    handleAuthStateChange();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!(currentUser || isRegistrationRequired)) {
    return <LoginScreen onCreateAuthAccount={setRegistrationRequired} {...{ setCurrentUser }} />;
  }

  return (
    <Root>
      <AppContext.Provider
        value={{
          newContact,
          setNewContact,
          selectedConversationId,
          setSelectedConversationId,
        }}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          {isRegistrationRequired ? (
            <CompleteSignUpScreen onUpdate={setRegistrationComplete} {...{ currentUser, setCurrentUser }} />
          ) : (
            <RootTab />
          )}
        </View>
      </AppContext.Provider>
    </Root>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'grey',
    flex: 1,
  },
});
