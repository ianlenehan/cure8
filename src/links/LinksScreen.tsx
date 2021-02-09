import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';

import useCurrentUser from '@cure8/hooks/useCurrentUser';
import { Spinner } from '@cure8/common';

import Links from './Links';
import useApi from './useApi';

const LinksScreen = ({ navigation }: any) => {
  const { getArchivedLinks, getLinks, links, loading } = useApi();

  // const [page, setPage] = useState(1);
  // const itemCount = page * 10;

  if (loading && !links.length) {
    return <Spinner />;
  }

  return (
    <Links
      curations={links}
      refetch={getLinks}
      fetchArchivedLinks={getArchivedLinks}
      {...{ navigation }}
      // onLoadMore={handleLoadMore}
    />
  );
};

export default LinksScreen;
