import React from 'react';
import { useQuery } from 'react-apollo';
import {
  NavigationBottomTabScreenComponent,
  NavigationTabScreenProps
} from 'react-navigation-tabs';

import { Spinner } from '../common';

import Links from './Links';
import { FETCH_NEW_LINKS } from './graphql';

const LinksScreen: NavigationBottomTabScreenComponent<NavigationTabScreenProps> = ({
  navigation
}) => {
  const { data, loading, error, refetch } = useQuery(FETCH_NEW_LINKS);

  const handleNewLinkPress = () => {
    navigation.navigate('NewLink');
  };

  if (loading) return <Spinner />;

  return (
    <Links
      curations={data && data.curations}
      onNewLinkPress={handleNewLinkPress}
      refetch={refetch}
    />
  );
};

export default LinksScreen;
