import React from 'react';
import { useQuery, useLazyQuery } from 'react-apollo';
import { Icon } from 'react-native-elements';

import { Spinner } from '../common';

import Links from './Links';
import { FETCH_NEW_LINKS, FETCH_ARCHIVED_LINKS } from './graphql';

const LinksScreen = ({ navigation }: any) => {
  const { data, loading, error, refetch } = useQuery(FETCH_NEW_LINKS);
  const [fetchArchivedLinks, { data: archivedData }] = useLazyQuery(
    FETCH_ARCHIVED_LINKS,
    {
      variables: { tagIds: [] },
      fetchPolicy: 'network-only'
    }
  );

  if (loading) return <Spinner />;

  const handleSetOptions = (onPress: () => void) => {
    console.log('called set');
    return navigation.setOptions({
      headerRight: () => (
        <Icon
          name="plus"
          type="font-awesome"
          color="white"
          containerStyle={{ marginRight: 25 }}
          {...{ onPress }}
        />
      )
    });
  };

  return (
    <Links
      {...{ refetch, fetchArchivedLinks, navigation }}
      curations={data && data.curations}
      onSetOptions={handleSetOptions}
    />
  );
};

export default LinksScreen;
