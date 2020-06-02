import React, { useEffect } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { get } from 'lodash';

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

const ConversationsScreen = ({ navigation, route }: any) => {
  const { data, loading } = useQuery(QUERY);

  useEffect(() => {
    if (get(route, 'params.conversationId')) {
      navigation.navigate('Conversation', {
        conversationId: route.params.conversationId
      });
    }
  }, [route.params]);

  if (loading) return <Spinner />;

  const handleConversationPress = (conversationId: string) => {
    navigation.navigate('Conversation', { conversationId });
  };

  const renderItem = ({ item }: { item: ConversationType }) => {
    return (
      <ConversationItem conversation={item} onPress={handleConversationPress} />
    );
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
    <View style={styles.container}>
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
    flex: 1,
    backgroundColor: '#ecf0f1'
  },
  container: {
    flex: 1
  }
});
