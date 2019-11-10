import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import IonIcon from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import { NavigationStackOptions } from 'react-navigation-stack';

import { colors } from '../common';

// type Props = {
//   navigation: NavigationStackProp<{ userId: string }>;
// };

import LinksScreen from '../links/LinksScreen';
import NewLinkModal from '../links/NewLinkModal';

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
    NewLink: NewLinkModal
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

const MainTabNavigator = createBottomTabNavigator(
  {
    Links: LinksScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName = 'link';
        // if (routeName === 'Stats') {
        //   iconName = 'ios-stats';
        // } else if (routeName === 'Players') {
        //   iconName = 'ios-contacts';
        // } else if (routeName === 'NewRound') {
        //   iconName = 'ios-add-circle';
        // } else if (routeName === 'Rounds') {
        //   iconName = 'ios-list-box';
        // } else if (routeName === 'Availability') {
        //   iconName = 'ios-calendar';
        // }

        // You can return any component that you like here!
        return <IonIcon name={iconName} size={25} color={tintColor} />;
      }
    }),
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
    NewLink: NewLinkStack
  },
  {
    defaultNavigationOptions
  }
);

export default RootStackNavigator;
