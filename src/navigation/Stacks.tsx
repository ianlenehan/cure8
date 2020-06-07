import React from 'react';
import { Image } from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp
} from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

import RootTab from './RootTab';
import LinksScreen from '../links/LinksScreen';
import ArchivedLinksScreen from '../links/ArchivedLinksScreen';
import ContactsScreen from '../contacts/ContactsScreen';
import AddContactScreen from '../contacts/AddContactScreen';
import SettingsScreen from '../settings/SettingsScreen';
import ActivityScreen from '../activity/ActivityScreen';
import ConversationsScreen from '../chat/ConversationsScreen';
import ConversationScreen from '../chat/ConversationScreen';

import { AppText, Button, colors } from '../common';

export type RootStackParamList = {
  Main: undefined;
  Links: undefined;
  ArchivedLinks: undefined;
  Conversations: undefined;
  Conversation: undefined;
  Contacts: undefined;
  Activity: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const LogoTitle = () => {
  return (
    <Image
      source={require('../assets/images/logo_clear.png')}
      style={{ width: 80, height: 30 }}
    />
  );
};

const screenOptions = {
  headerStyle: {
    backgroundColor: colors.primaryGreen,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold'
  },
  headerTitle: () => <LogoTitle />
};

export const LinksStack = () => {
  return (
    <Stack.Navigator {...{ screenOptions }}>
      <Stack.Screen name="Links" component={LinksScreen} />
    </Stack.Navigator>
  );
};

export const ArchivedLinksStack = () => {
  return (
    <Stack.Navigator {...{ screenOptions }}>
      <Stack.Screen name="ArchivedLinks" component={ArchivedLinksScreen} />
    </Stack.Navigator>
  );
};

export const ConversationsStack = () => {
  return (
    <Stack.Navigator {...{ screenOptions }}>
      <Stack.Screen name="Conversations" component={ConversationsScreen} />
      <Stack.Screen name="Conversation" component={ConversationScreen} />
    </Stack.Navigator>
  );
};

export const ContactsStack = () => {
  return (
    <Stack.Navigator {...{ screenOptions }}>
      <Stack.Screen name="Contacts" component={ContactsScreen} />
      <Stack.Screen name="AddContact" component={AddContactScreen} />
    </Stack.Navigator>
  );
};

export const ActivityStack = () => {
  return (
    <Stack.Navigator {...{ screenOptions }}>
      <Stack.Screen name="Activity" component={ActivityScreen} />
    </Stack.Navigator>
  );
};

export const SettingsStack = () => {
  return (
    <Stack.Navigator {...{ screenOptions }}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};
