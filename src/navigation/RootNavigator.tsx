import React from 'react';
import { Image } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationStackOptions } from 'react-navigation-stack';

// type Props = {
//   navigation: NavigationStackProp<{ userId: string }>;
// };

import LinksScreen from '../links/LinksScreen';
import NewLinkModal from '../links/NewLinkModal';

// const LogoTitle = () => {
//   return (
//     <Image
//       source={require('../images/ParTownLogoWhite.png')}
//       style={{width: 80, height: 30}}
//     />
//   );
// };

const defaultNavigationOptions: NavigationStackOptions = {
  headerStyle: {
    backgroundColor: 'green',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold'
  }
};

const MainStackNavigator = createStackNavigator(
  {
    Links: LinksScreen
  },
  {
    defaultNavigationOptions
  }
);

const RootStackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainStackNavigator
    },
    NewLink: NewLinkModal
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

export default RootStackNavigator;
