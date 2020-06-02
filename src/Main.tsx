import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { Root } from 'native-base';
import { ApolloProvider } from 'react-apollo';

import AppContext from './utils/AppContext';
import RootTab from './navigation/RootTab';
import CompleteSignUpScreen from './auth/CompleteSignUpScreen';

const Main = (props: any) => {
  const {
    apolloClient,
    authUser,
    setAuthUser,
    newContact,
    setNewContact,
    showSignupScreen
  } = props;

  if (!apolloClient) {
    return null;
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Root>
        <AppContext.Provider
          value={{ authUser, setAuthUser, newContact, setNewContact }}>
          <StatusBar barStyle="light-content" />
          <View style={styles.container}>
            {showSignupScreen ? <CompleteSignUpScreen /> : <RootTab />}
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
