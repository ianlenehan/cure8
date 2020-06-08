import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/FontAwesome';
import gql from 'graphql-tag';
import { useQuery, useMutation } from 'react-apollo';

import {
  LinksStack,
  ArchivedLinksStack,
  ConversationsStack,
  ContactsStack,
  ActivityStack,
  SettingsStack
} from './Stacks';
import useAppContext from '../hooks/useAppContext';

import { colors, Spinner } from '../common';

const Tab = createBottomTabNavigator();

const FETCH_CURRENT_USER = gql`
  query currentUser {
    appUser {
      id
      name
      pushToken
    }
  }
`;

const SET_PUSH_TOKEN = gql`
  mutation SetPushToken($pushToken: String!) {
    setPushToken(pushToken: $pushToken) {
      appUser {
        id
        pushToken
      }
    }
  }
`;

const RootTab = ({ currentPushId }: { currentPushId?: string }) => {
  const { data, loading: loadingCurrentUser } = useQuery(FETCH_CURRENT_USER);
  const [setPushToken] = useMutation(SET_PUSH_TOKEN);

  const { setCurrentUser } = useAppContext();

  useEffect(() => {
    if (
      currentPushId &&
      data?.appUser &&
      currentPushId !== data.appUser.pushToken
    ) {
      setPushToken({ variables: { pushToken: currentPushId } });
    }
  }, [currentPushId, data?.appUser]);

  useEffect(() => {
    if (data?.appUser) {
      setCurrentUser(data?.appUser);
    }
  }, [data]);

  if (loadingCurrentUser) {
    return <Spinner />;
  }

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primaryGreen,
        inactiveTintColor: 'gray',
        showLabel: false
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'link';

          if (route.name === 'Contacts') {
            iconName = 'address-book';
          } else if (route.name === 'Archived Links') {
            iconName = 'archive';
          } else if (route.name === 'Settings') {
            iconName = 'gears';
          } else if (route.name === 'Activity') {
            iconName = 'list';
          } else if (route.name === 'Conversations') {
            iconName = 'comments';
          }

          return <IonIcon name={iconName} size={25} color={color} />;
        }
      })}>
      <Tab.Screen name="Links" component={LinksStack} />
      <Tab.Screen name="Archived Links" component={ArchivedLinksStack} />
      <Tab.Screen name="Conversations" component={ConversationsStack} />
      <Tab.Screen name="Contacts" component={ContactsStack} />
      <Tab.Screen name="Activity" component={ActivityStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};

export default RootTab;
