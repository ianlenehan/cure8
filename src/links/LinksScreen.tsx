import React from 'react';
import { useQuery, useLazyQuery } from 'react-apollo';
import {
  NavigationBottomTabScreenComponent,
  NavigationTabScreenProps
} from 'react-navigation-tabs';

import { Spinner } from '../common';

import Links from './Links';
import { FETCH_NEW_LINKS, FETCH_ARCHIVED_LINKS } from './graphql';

const LinksScreen: NavigationBottomTabScreenComponent<NavigationTabScreenProps> = ({
  navigation
}) => {
  const { data, loading, error, refetch } = useQuery(FETCH_NEW_LINKS);
  const [fetchArchivedLinks, { data: archivedData }] = useLazyQuery(
    FETCH_ARCHIVED_LINKS,
    {
      variables: { tagIds: [] },
      fetchPolicy: 'network-only'
    }
  );
  console.log('TCL: archivedData', archivedData);

  if (loading) return <Spinner />;

  return (
    <Links
      {...{ refetch, fetchArchivedLinks }}
      curations={data && data.curations}
      setParams={navigation.setParams}
    />
  );
};

export default LinksScreen;
