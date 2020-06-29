import React, { useState } from 'react';
import { useQuery, useLazyQuery } from 'react-apollo';
import { Icon } from 'react-native-elements';

import { Spinner } from '../common';

import Links from './Links';
import { FETCH_NEW_LINKS, FETCH_ARCHIVED_LINKS } from './graphql';

const LinksScreen = ({ navigation }: any) => {
  const [page, setPage] = useState(1);
  const itemCount = page * 10;

  const { data, loading, refetch, error } = useQuery(FETCH_NEW_LINKS, {
    variables: { showItemCount: itemCount }
  });

  const [fetchArchivedLinks, { data: archivedData }] = useLazyQuery(
    FETCH_ARCHIVED_LINKS,
    {
      variables: { tagIds: [], showItemCount: itemCount },
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

  return (
    <Links
      {...{ curations, refetch, fetchArchivedLinks, navigation }}
      onLoadMore={handleLoadMore}
    />
  );
};

export default LinksScreen;
