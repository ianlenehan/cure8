import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';

import { Spinner } from '../common';

import Links from './Links';
import { FETCH_ARCHIVED_LINKS } from './graphql';

type Tag = {
  id: string;
  name: string;
};

const ArchivedLinksScreen = ({ navigation }: any) => {
  const [filteredTagIds, setFilteredTagIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const itemCount = page * 10;

  const { data, loading, refetch } = useQuery(FETCH_ARCHIVED_LINKS, {
    variables: { tagIds: filteredTagIds, showItemCount: itemCount }
  });

  const handleTagPress = (tag: Tag) => {
    if (filteredTagIds.includes(tag.id)) {
      const otherTagIds = filteredTagIds.filter(id => id !== tag.id);
      setFilteredTagIds(otherTagIds);
    } else {
      setFilteredTagIds(prevState => [...prevState, tag.id]);
    }
  };

  const handleClearTagFilter = () => setFilteredTagIds([]);

  if (loading && !data) return <Spinner />;

  const { curations, hasMorePages } = data;

  const handleLoadMore = () => {
    if (!hasMorePages) {
      return null;
    }

    setPage(page + 1);
  };

  return (
    <Links
      {...{ refetch, filteredTagIds, curations, navigation }}
      onLoadMore={handleLoadMore}
      onTagPress={handleTagPress}
      onClearTagFilter={handleClearTagFilter}
      isArchivedLinks
    />
  );
};

export default ArchivedLinksScreen;
