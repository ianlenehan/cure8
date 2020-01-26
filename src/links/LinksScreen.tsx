import React, { useEffect } from 'react';
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

  if (loading) return <Spinner />;

  return (
    <Links
      curations={data && data.curations}
      refetch={refetch}
      setParams={navigation.setParams}
    />
  );
};

export default LinksScreen;
