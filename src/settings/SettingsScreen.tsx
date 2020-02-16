import React from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import firebase from 'react-native-firebase';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Container, AppText, Button, Spinner, Spacer } from '../common';

export const FETCH_CURRENT_USER = gql`
  query currentUser {
    appUser {
      id
      name
      phone
      notifications
      notificationsNewLink
      notificationsNewRating
    }
  }
`;

export const TOGGLE_SETTING = gql`
  mutation ToggleSetting($settingName: String!) {
    toggleSetting(settingName: $settingName) {
      user {
        id
      }
    }
  }
`;

const SettingsScreen = () => {
  const { data, loading, refetch } = useQuery(FETCH_CURRENT_USER);

  const [toggleSetting] = useMutation(TOGGLE_SETTING);

  if (loading || !data) return <Spinner />;

  const {
    name,
    phone,
    notifications,
    notificationsNewLink,
    notificationsNewRating
  } = data.appUser;

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const handleToggleSetting = async (settingName: string) => {
    await toggleSetting({ variables: { settingName } });
    refetch();
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
            value={notifications}
            onValueChange={() => handleToggleSetting('notifications')}
          />
        </View>
        <View style={styles.listItemContainer}>
          <AppText size="medium">New link notifications</AppText>
          <Switch
            value={notificationsNewLink}
            onValueChange={() => handleToggleSetting('notificationsNewLink')}
            disabled={!notifications}
          />
        </View>
        <View style={styles.listItemContainer}>
          <AppText size="medium">New rating notifications</AppText>
          <Switch
            value={notificationsNewRating}
            onValueChange={() => handleToggleSetting('notificationsNewRating')}
            disabled={!notifications}
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
