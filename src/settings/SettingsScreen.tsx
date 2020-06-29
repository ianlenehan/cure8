import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Container, AppText, Button, Spinner, Spacer } from '../common';

const FETCH_PUSH_TOKEN = gql`
  query pushToken($token: String!) {
    pushToken(token: $token) {
      id
      token
      notify
      notifyNewLink
      notifyNewMessage
      notifyNewRating
    }
    appUser {
      id
      name
      phone
    }
  }
`;

const TOGGLE_NOTIFICATION = gql`
  mutation toggleNotification($tokenId: String!, $field: String!) {
    toggleNotification(tokenId: $tokenId, field: $field) {
      pushToken {
        id
        token
        notify
        notifyNewLink
        notifyNewMessage
        notifyNewRating
      }
    }
  }
`;

const SettingsScreen = ({ route }: { route: any }) => {
  const { currentPushId: tokenId } = route.params;

  const { data, loading, refetch } = useQuery(FETCH_PUSH_TOKEN, {
    variables: { token: tokenId }
  });

  const [toggleNotification] = useMutation(TOGGLE_NOTIFICATION);

  if (loading || !data) return <Spinner />;

  const {
    notify,
    notifyNewLink,
    notifyNewMessage,
    notifyNewRating
  } = data.pushToken;

  const { name, phone } = data.appUser;

  const handleLogout = () => {
    auth().signOut();
  };

  const handleToggleSetting = async (field: string) => {
    await toggleNotification({ variables: { field, tokenId } });
  };

  return (
    <Container color="white">
      <View style={styles.pageWrapper}>
        <AppText align="center" size="xlarge">
          {name}
        </AppText>
        <AppText size="medium" align="center">
          {phone}
        </AppText>
        <Spacer size={4} />
        <AppText size="large">Notification Settings</AppText>
        <View style={styles.listItemContainer}>
          <AppText size="medium">Notifications</AppText>
          <Switch
            value={notify}
            onValueChange={() => handleToggleSetting('notify')}
          />
        </View>
        <View style={styles.listItemContainer}>
          <AppText size="medium">New link notifications</AppText>
          <Switch
            value={notifyNewLink}
            onValueChange={() => handleToggleSetting('notify_new_link')}
            disabled={!notify}
          />
        </View>
        <View style={styles.listItemContainer}>
          <AppText size="medium">New message notifications</AppText>
          <Switch
            value={notifyNewMessage}
            onValueChange={() => handleToggleSetting('notify_new_message')}
            disabled={!notify}
          />
        </View>
        <View style={styles.listItemContainer}>
          <AppText size="medium">New rating notifications</AppText>
          <Switch
            value={notifyNewRating}
            onValueChange={() => handleToggleSetting('notify_new_rating')}
            disabled={!notify}
          />
        </View>
      </View>
      <Button size="small" onPress={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    padding: 10
  },
  listItemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export default SettingsScreen;
