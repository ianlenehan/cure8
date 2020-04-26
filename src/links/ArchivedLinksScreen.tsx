import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import {
  NavigationBottomTabScreenComponent,
  NavigationTabScreenProps
} from 'react-navigation-tabs';

import { Spinner } from '../common';

import Links from './Links';
import { FETCH_ARCHIVED_LINKS } from './graphql';

type Tag = {
  id: string;
  name: string;
};

const ArchivedLinksScreen: NavigationBottomTabScreenComponent<
  NavigationTabScreenProps
> = () => {
  const [filteredTagIds, setFilteredTagIds] = useState<string[]>([]);

  const { data, loading, error, refetch } = useQuery(FETCH_ARCHIVED_LINKS, {
    variables: { tagIds: filteredTagIds }
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

  const curations = data && data.curations;

  return (
    <Links
      {...{ refetch, filteredTagIds, curations }}
      onTagPress={handleTagPress}
      onClearTagFilter={handleClearTagFilter}
      isArchivedLinks
    />
  );
};

export default ArchivedLinksScreen;
