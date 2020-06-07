import React, { useState } from 'react';
import { useQuery, useLazyQuery } from 'react-apollo';
import { Icon } from 'react-native-elements';

import { Spinner } from '../common';

import Links from './Links';
import { FETCH_NEW_LINKS, FETCH_ARCHIVED_LINKS } from './graphql';

const LinksScreen = ({ navigation }: any) => {
  const [page, setPage] = useState(1);
  const itemCount = page * 10;

  const { data, loading, refetch } = useQuery(FETCH_NEW_LINKS, {
    variables: { showItemCount: itemCount }
  });

  const [fetchArchivedLinks, { data: archivedData }] = useLazyQuery(
    FETCH_ARCHIVED_LINKS,
    {
      variables: { tagIds: [] },
      fetchPolicy: 'network-only'
    }
  );

  if (loading) return <Spinner />;

  const { curations, hasMorePages } = data;

  const handleLoadMore = () => {
    if (!hasMorePages) {
      return null;
    }

    setPage(page + 1);
  };

  const handleSetOptions = (onPress: () => void) => {
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
      {...{ curations, refetch, fetchArchivedLinks, navigation }}
      onLoadMore={handleLoadMore}
      onSetOptions={handleSetOptions}
    />
  );
};

export default LinksScreen;
