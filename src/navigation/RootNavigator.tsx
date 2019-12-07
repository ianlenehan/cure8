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
import NewLinkScreen from '../links/NewLinkScreen';
import ContactsScreen from '../contacts/ContactsScreen';
import AddContactScreen from '../contacts/AddContactScreen';

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

const NewLinkStack = createStackNavigator(
  {
    NewLink: NewLinkScreen
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

const MainTabNavigator = createBottomTabNavigator(
  {
    Links: LinksScreen,
    Contacts: ContactsScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          const { routeName } = navigation.state;
          let iconName = 'link';
          if (routeName === 'Contacts') {
            iconName = 'address-book';
            // } else if (routeName === 'Players') {
            //   iconName = 'ios-contacts';
            // } else if (routeName === 'NewRound') {
            //   iconName = 'ios-add-circle';
            // } else if (routeName === 'Rounds') {
            //   iconName = 'ios-list-box';
            // } else if (routeName === 'Availability') {
            //   iconName = 'ios-calendar';
          }

          // You can return any component that you like here!
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
    NewLink: NewLinkStack,
    AddContact: AddContactScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      let contactsParams: any = null;
      let routeName = navigation.state.routeName;

      if (navigation.state.routes) {
        const contactsRoute = navigation.state.routes.find(
          route => route.routeName === 'Contacts'
        );
        contactsParams = (contactsRoute && contactsRoute.params) || {};

        routeName = navigation.state.routes[navigation.state.index].routeName;
      }

      let headerRight = null;
      let headerTitle = defaultNavigationOptions.headerTitle;

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

      if (routeName === 'NewLink') {
        headerTitle = (
          <AppText color="white" size="large">
            Curate New Link
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
