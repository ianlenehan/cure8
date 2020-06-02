import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from 'react-native-elements';

import { Spinner } from '../common';

import Links from './Links';
import { FETCH_ARCHIVED_LINKS } from './graphql';

import { LinkScreenNavigationProp } from './LinksScreen';

type Tag = {
  id: string;
  name: string;
};

type Props = {
  navigation: LinkScreenNavigationProp;
};

const ArchivedLinksScreen = ({ navigation }: Props) => {
  const [filteredTagIds, setFilteredTagIds] = useState<string[]>([]);

  const { data, loading, error, refetch } = useQuery(FETCH_ARCHIVED_LINKS, {
    variables: { tagIds: filteredTagIds }
  });
  console.log('ArchivedLinksScreen -> data', error);

  const handleTagPress = (tag: Tag) => {
    if (filteredTagIds.includes(tag.id)) {
      const otherTagIds = filteredTagIds.filter(id => id !== tag.id);
      setFilteredTagIds(otherTagIds);
    } else {
      setFilteredTagIds(prevState => [...prevState, tag.id]);
    }
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

  const handleClearTagFilter = () => setFilteredTagIds([]);

  if (loading && !data) return <Spinner />;

  const curations = data && data.curations;

  return (
    <Links
      {...{ refetch, filteredTagIds, curations }}
      onSetOptions={handleSetOptions}
      onTagPress={handleTagPress}
      onClearTagFilter={handleClearTagFilter}
      isArchivedLinks
    />
  );
};

export default ArchivedLinksScreen;
