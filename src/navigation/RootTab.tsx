import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/FontAwesome';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client'

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
    }
    pushTokens {
      id
      token
    }
  }
`;

const CREATE_PUSH_TOKEN = gql`
  mutation CreatePushToken($pushToken: String!) {
    createPushToken(pushToken: $pushToken) {
      pushTokens {
        id
        token
      }
    }
  }
`;

const RootTab = ({ currentPushId }: { currentPushId?: string }) => {
  const { data, loading: loadingCurrentUser } = useQuery(FETCH_CURRENT_USER);
  const [createPushToken] = useMutation(CREATE_PUSH_TOKEN);

  const { setCurrentUser } = useAppContext();

  useEffect(() => {
    const tokens = data?.pushTokens ? data.pushTokens.map(({token} : { token: string }) => token) : []
    if (data && currentPushId && !tokens.includes(currentPushId)) {
      createPushToken({ variables: { pushToken: currentPushId } });
    }
  }, [currentPushId, data?.pushTokens]);

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
      <Tab.Screen name="Settings" component={SettingsStack} initialParams={{ currentPushId }} />
    </Tab.Navigator>
  );
};

export default RootTab;
