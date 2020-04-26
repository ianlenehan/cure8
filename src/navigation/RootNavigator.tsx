import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import IonIcon from 'react-native-vector-icons/FontAwesome';
import { Icon, Button } from 'react-native-elements';
import { NavigationStackOptions } from 'react-navigation-stack';

import { AppText, colors } from '../common';

// type Props = {
//   navigation: NavigationStackProp<{ userId: string }>;
// };

import LinksScreen from '../links/LinksScreen';
import ArchivedLinksScreen from '../links/ArchivedLinksScreen';
import ContactsScreen from '../contacts/ContactsScreen';
import AddContactScreen from '../contacts/AddContactScreen';
import SettingsScreen from '../settings/SettingsScreen';
import ActivityScreen from '../activity/ActivityScreen';
import ConversationsScreen from '../chat/ConversationsScreen';
import ConversationScreen from '../chat/ConversationScreen';

const LogoTitle = () => {
  return (
    <Image
      source={require('../assets/images/logo_clear.png')}
      style={{ width: 80, height: 30 }}
    />
  );
};

const defaultNavigationOptions: NavigationStackOptions = {
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
  headerTitle: <LogoTitle />
};

const MainTabNavigator = createBottomTabNavigator(
  {
    Links: LinksScreen,
    ArchivedLinks: ArchivedLinksScreen,
    Contacts: ContactsScreen,
    Conversations: ConversationsScreen,
    Activity: ActivityScreen,
    Settings: SettingsScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName = 'link';
          if (routeName === 'Contacts') {
            iconName = 'address-book';
          } else if (routeName === 'ArchivedLinks') {
            iconName = 'archive';
          } else if (routeName === 'Settings') {
            iconName = 'gears';
          } else if (routeName === 'Activity') {
            iconName = 'list';
          } else if (routeName === 'Conversations') {
            iconName = 'comments';
          }

          return <IonIcon name={iconName} size={25} color={tintColor} />;
        }
      };
    },
    tabBarOptions: {
      activeTintColor: colors.primaryGreen,
      inactiveTintColor: 'gray',
      showLabel: false
    }
  }
);

const RootStackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator
    },
    AddContact: AddContactScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      let contactsParams: any = {};
      let linksParams: any = {};
      let routeName = navigation.state.routeName;

      if (navigation.state.routes) {
        const contactsRoute = navigation.state.routes.find(
          ({ routeName }) => routeName === 'Contacts'
        );
        contactsParams = (contactsRoute && contactsRoute.params) || {};

        const linksRoute = navigation.state.routes.find(
          ({ routeName }) => routeName === 'Links'
        );
        linksParams = (linksRoute && linksRoute.params) || {};

        routeName = navigation.state.routes[navigation.state.index].routeName;
      }

      let headerRight = null;
      let headerTitle = defaultNavigationOptions.headerTitle;

      if (routeName === 'Links') {
        headerRight = () => (
          <Icon
            name="plus"
            type="font-awesome"
            color="white"
            onPress={linksParams.onNewLinkPress}
            containerStyle={{ marginRight: 25 }}
          />
        );
      }

      if (routeName === 'Contacts' && contactsParams) {
        headerRight = () => (
          <Button
            title={contactsParams.buttonText || ''}
            type="clear"
            onPress={contactsParams.toggleEditMode}
            titleStyle={{ fontSize: 16, color: 'white' }}
            containerStyle={{ marginRight: 10 }}
          />
        );
      }

      if (routeName === 'AddContact') {
        headerTitle = (
          <AppText color="white" size="large">
            {navigation.state.params.contactName}
          </AppText>
        );
      }

      if (routeName === 'ArchivedLinks') {
        headerTitle = (
          <AppText color="white" size="large">
            Archived Links
          </AppText>
        );
      }

      if (routeName === 'Conversations') {
        headerTitle = (
          <AppText color="white" size="large">
            Conversations
          </AppText>
        );
      }

      if (routeName === 'Activity') {
        headerTitle = (
          <AppText color="white" size="large">
            Activity
          </AppText>
        );
      }

      if (routeName === 'Settings') {
        headerTitle = (
          <AppText color="white" size="large">
            Settings
          </AppText>
        );
      }

      return {
        ...defaultNavigationOptions,
        headerTitle,
        headerRight
      };
    }
  }
);

export default RootStackNavigator;
