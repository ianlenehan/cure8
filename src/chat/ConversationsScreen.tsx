import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import ConversationItem from './ConversationItem';
import { ConversationType } from './types';

import { AppText, Spinner } from '../common';

const QUERY = gql`
  query {
    conversations {
      id
      title
      updatedAt
      users {
        id
        name
        phone
      }
    }
  }
`;

const ConversationsScreen = () => {
  const { data, loading } = useQuery(QUERY);
  console.log('ConversationsScreen -> data', data);
  if (loading) return <Spinner />;

  const renderItem = ({ item }: { item: ConversationType }) => {
    return <ConversationItem conversation={item} />;
  };

  if (!data.conversations.length) {
    return (
      <View style={styles.emptyPage}>
        <AppText size="medium">
          You haven't started any conversations yet.
        </AppText>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={data.conversations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
      />
    </View>
  );
};

export default ConversationsScreen;

const styles = StyleSheet.create({
  emptyPage: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});
