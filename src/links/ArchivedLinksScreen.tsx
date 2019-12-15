import React from 'react';
import { useQuery } from 'react-apollo';
import {
  NavigationBottomTabScreenComponent,
  NavigationTabScreenProps
} from 'react-navigation-tabs';

import { Spinner } from '../common';

import Links from './Links';
import { FETCH_ARCHIVED_LINKS } from './graphql';

const ArchivedLinksScreen: NavigationBottomTabScreenComponent<NavigationTabScreenProps> = ({
  navigation
}) => {
  const { data, loading, error, refetch } = useQuery(FETCH_ARCHIVED_LINKS);

  const handleNewLinkPress = () => {
    navigation.navigate('NewLink');
  };

  if (loading) return <Spinner />;

  return (
    <Links
      curations={data && data.archivedCurations}
      onNewLinkPress={handleNewLinkPress}
      refetch={refetch}
      archivedLinks
    />
  );
};

export default ArchivedLinksScreen;
