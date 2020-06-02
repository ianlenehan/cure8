import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/FontAwesome';

import {
  LinksStack,
  ArchivedLinksStack,
  ConversationsStack,
  ContactsStack,
  ActivityStack,
  SettingsStack
} from './Stacks';

import { AppText, colors } from '../common';

const Tab = createBottomTabNavigator();

const RootTab = () => {
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
