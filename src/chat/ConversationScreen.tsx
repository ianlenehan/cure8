import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, Text, View, SectionList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { uniq } from 'lodash';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import getSectionItemLayout from './helpers';
import useHookWithRefCallback from './useHookWithRefCallback';

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
  mutation SendMessageNotification($conversationId: String!, $message: String!) {
    sendMessageNotification(conversationId: $conversationId, message: $message) {
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

  const [listRef] = useHookWithRefCallback();

  const { conversationId } = route.params;

  const { data, loading } = useQuery(FETCH_CURRENT_USER);
  const [sendMessageNotification, { error }] = useMutation(SEND_MESSAGE_NOTIFICATION);

  const [loadingMessages, startLoadingMessages, stopLoadingMessages] = useBoolean(false);

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
      });

    return () => unsubscribe();
  }, [conversationId]);

  const messageSections = useMemo(() => {
    const sections = uniq(messages.map(message => message.date));
    return sections.map(section => {
      const data = messages.filter(message => message.date === section);
      return { title: section, data };
    });
  }, [messages]);

  if (loading || loadingMessages) return <Spinner />;

  const { currentUser } = data;

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

  // const getItemLayout = (data, index) => {
  //   const linesCount = Math.ceil(data.text.length / 32);

  //   const rowHasName = data.userId !== currentUser.id;
  //   const baseHeight = rowHasName ? 83 : 65;
  //   const itemHeight = (linesCount - 1) * 21 + baseHeight;
  //   return {
  //     length: itemHeight,
  //     offset: itemHeight * index,
  //     index
  //   };
  // };

  // const getItemLayout = getSectionItemLayout({
  //   // The height of the row with rowData at the given sectionIndex and rowIndex
  //   getItemHeight: (rowData, sectionIndex, rowIndex) => {
  //     console.log('rowIndex', rowIndex);
  //     console.log('rowData', rowData);
  //     console.log('sectionIndex', sectionIndex);
  //     const linesCount = Math.ceil(rowData.text.length / 32);
  //     console.log('linesCount', linesCount);
  //     const rowHasName = rowData.userId !== currentUser.id;
  //     const baseHeight = rowHasName ? 83 : 65;
  //     return (linesCount - 1) * 21 + baseHeight;
  //     // console.log('rowHeight', rowHeight);
  //     // console.log('rowHasName', rowHasName);
  //     // return sectionIndex === 0 ? 100 : 50;
  //   },

  //   // These five properties are optional
  //   getSeparatorHeight: () => 0, // The height of your separators between items
  //   getSectionHeaderHeight: () => 17.5, // The height of your section headers
  //   getSectionFooterHeight: () => 0 // The height of your section footers
  //   // listHeaderHeight: 40, // The height of your header
  //   // listFooterHeight: 20 // The height of your footer
  // });

  return (
    <View style={styles.container}>
      <View style={styles.conversationContainer}>
        {renderContent()}
        <SectionList
          ref={listRef}
          sections={messageSections}
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
        <TextInput style={styles.input} value={message} onChangeText={handleChangeText} placeholder="Type message..." />
        <Icon name="arrow-circle-right" type="font-awesome" color="#fff" size={30} onPress={handleNewMessage} />
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
