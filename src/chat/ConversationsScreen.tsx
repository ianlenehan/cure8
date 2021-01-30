import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert, LayoutAnimation } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

import ConversationItem from './ConversationItem';
import { ConversationType } from './types';

import useToast from '../hooks/useToast';
import useAppContext from '../hooks/useAppContext';
import { AppText, Spinner, colors } from '../common';

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

const LEAVE_CONVERSATION = gql`
  mutation leaveConversation($conversationId: String!) {
    leaveConversation(conversationId: $conversationId) {
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
  }
`;

// TODO paginate conversations

const ConversationsScreen = ({ navigation }: any) => {
  const { data, loading, refetch } = useQuery(QUERY);
  const [leaveConversation] = useMutation(LEAVE_CONVERSATION);
  const { selectedConversationId, setSelectedConversationId } = useAppContext();

  const [openRows, setOpenRows] = useState<string[]>([]);

  useEffect(() => {
    if (selectedConversationId) {
      navigation.navigate('Conversation', {
        conversationId: selectedConversationId
      });
      setSelectedConversationId('');
    }
  }, [selectedConversationId]);

  if (loading) return <Spinner />;

  const handleConversationPress = (conversationId: string) => {
    navigation.navigate('Conversation', { conversationId });
  };

  const handleScrollEnabled = (rowKey: string) => {
    setOpenRows(prevState => [...prevState, rowKey]);
  };

  const handleRowDidClose = (rowKey: string) => {
    const newOpenRows = openRows.filter(row => row !== rowKey);
    setOpenRows(newOpenRows);
  };

  const renderItem = ({ item }: { item: ConversationType }) => {
    return <ConversationItem conversation={item} onPress={handleConversationPress} />;
  };

  if (!data.conversations.length) {
    return (
      <View style={styles.emptyPage}>
        <AppText size="medium">You haven't started any conversations yet.</AppText>
      </View>
    );
  }

  const renderHiddenItem = ({ item }: { item: ConversationType }) => {
    const handleDelete = async () => {
      setOpenRows([]);
      await leaveConversation({ variables: { conversationId: item.id } });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      await refetch();
      useToast('Conversation removed');
    };

    const onPress = () => {
      Alert.alert('Leave Conversation', 'Are you sure you want to leave this conversation?', [
        { text: 'Yes', onPress: handleDelete },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]);
    };

    return (
      <View style={styles.rowBack}>
        <Icon color={colors.tertiaryBlue} name="trash" type="font-awesome" reverse size={18} {...{ onPress }} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SwipeListView
        data={data.conversations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
        renderHiddenItem={renderHiddenItem}
        disableRightSwipe
        rightOpenValue={-80}
        onRowDidOpen={handleScrollEnabled}
        onRowDidClose={handleRowDidClose}
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
  },
  rowBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 10,
    margin: 10,
    marginBottom: 0,
    paddingBottom: 0
  }
});
