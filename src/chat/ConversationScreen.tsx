import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { uniq } from 'lodash';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import useBoolean from '../hooks/useBoolean';

import ChatBubble from './ChatBubble';

import { colors, Spinner, AppText, EmptyPage } from '../common';

const FETCH_CURRENT_USER = gql`
  query currentUser {
    currentUser: appUser {
      id
      name
      phone
      notifications
      notificationsNewLink
      notificationsNewRating
    }
  }
`;

const SEND_MESSAGE_NOTIFICATION = gql`
  mutation SendMessageNotification(
    $conversationId: String!
    $message: String!
  ) {
    sendMessageNotification(
      conversationId: $conversationId
      message: $message
    ) {
      conversation {
        id
      }
    }
  }
`;

type Message = {
  conversationId: string;
  text: string | undefined;
  userId: string;
  userName?: string;
  id: string;
  createdAt: Date;
  date?: string;
};

const ConversationScreen = ({ route }: any) => {
  const [message, setMessage] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);

  const { conversationId } = route.params;

  const { data, loading } = useQuery(FETCH_CURRENT_USER);
  const [sendMessageNotification, { error }] = useMutation(
    SEND_MESSAGE_NOTIFICATION
  );

  const [
    loadingMessages,
    startLoadingMessages,
    stopLoadingMessages
  ] = useBoolean(false);

  const messageRef = firestore().collection('messages');

  useEffect(() => {
    startLoadingMessages();
    const unsubscribe = messageRef
      .orderBy('createdAt')
      .where('conversationId', '==', conversationId)
      .onSnapshot(snapshot => {
        const updatedMessages = snapshot.docs.map((doc: any) => {
          const { createdAt, ...rest } = doc.data();

          return {
            createdAt,
            date: moment(createdAt.toDate()).format('MMM D, YYYY'),
            id: doc.id,
            ...rest
          };
        });
        setMessages(updatedMessages);
        stopLoadingMessages();
        console.log('unsubscribe -> updatedMessages', updatedMessages);
      });

    return () => unsubscribe();
  }, []);

  if (loading || loadingMessages) return <Spinner />;

  const { currentUser } = data;

  const getMessageSections = () => {
    const sections = uniq(messages.map(message => message.date));
    return sections.map(section => {
      const data = messages.filter(message => message.date === section);
      return { title: section, data };
    });
  };

  const handleNewMessage = async () => {
    const newMessage = {
      text: message,
      conversationId,
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date()
    };
    await messageRef.add(newMessage);
    sendMessageNotification({ variables: { conversationId, message } });
    setMessage('');
  };

  const handleChangeText = (text: string) => {
    setMessage(text);
  };

  const renderChatBubble = ({ item }: any) => {
    const userName = item.userId === currentUser.id ? undefined : item.userName;

    return (
      <ChatBubble
        text={item.text}
        time={moment(item.createdAt.toDate()).format('LT')}
        currentUserMessage={item.userId === currentUser.id}
        {...{ userName }}
      />
    );
  };

  const renderContent = () => {
    if (!messages.length) {
      return (
        <EmptyPage>
          <AppText size="medium">Start the conversation below!</AppText>
        </EmptyPage>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.conversationContainer}>
        {renderContent()}
        <SectionList
          sections={getMessageSections()}
          keyExtractor={item => item.id}
          renderItem={renderChatBubble}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderWrapper}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
              </View>
            </View>
          )}
        />
      </View>
      <KeyboardAvoidingView
        style={styles.chatFooter}
        keyboardVerticalOffset={90}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={handleChangeText}
          placeholder="Type message..."
        />
        <Icon
          name="arrow-circle-right"
          type="font-awesome"
          color="#fff"
          size={30}
          onPress={handleNewMessage}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

export default ConversationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  conversationContainer: {
    flex: 1,
    paddingRight: 15,
    paddingLeft: 15
  },
  chatFooter: {
    backgroundColor: colors.tertiaryBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 30,
    fontSize: 16,
    flex: 1,
    margin: 8,
    padding: 5,
    color: colors.textGrey
  },
  sectionTitle: {
    textAlign: 'center',
    color: colors.textGrey
  },
  sectionHeader: {
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
    borderRadius: 10
  },
  sectionHeaderWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 5
  }
});
