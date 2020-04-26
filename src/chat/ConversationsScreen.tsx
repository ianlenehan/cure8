import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import { AppText, Spinner } from '../common';

const QUERY = gql`
  query {
    conversations {
      id
      title
    }
  }
`;

const ConversationsScreen = () => {
  const { data, loading } = useQuery(QUERY);
  console.log('ConversationsScreen -> data', data);
  if (loading) return <Spinner />;

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
      <Text>Chat list</Text>
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
