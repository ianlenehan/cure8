import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SectionList, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import firebase from 'react-native-firebase';
import moment from 'moment';
import { uniq } from 'lodash';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import ChatBubble from './ChatBubble';

import { colors, Spinner } from '../common';

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

type Message = {
  conversationId: string;
  text: string | undefined;
  userId: string;
  userName?: string;
  id?: string;
  createdAt: Date;
  date?: string;
};

const ConversationScreen = () => {
  const [message, setMessage] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);

  const { data, loading } = useQuery(FETCH_CURRENT_USER);
  const { currentUser } = data;
  console.log('ConversationScreen -> data', data);

  const firestore = firebase.firestore();
  const messageRef = firestore.collection('messages');

  useEffect(() => {
    const unsubscribe = messageRef
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const updatedMessages = snapshot.docs.map((doc: any) => {
          const { text, createdAt, userId, conversationId } = doc.data();

          return {
            conversationId,
            createdAt,
            date: moment(createdAt.toDate()).format('MMM D, YYYY'),
            id: doc.id,
            text,
            userId
          };
        });
        setMessages(updatedMessages);
      });

    return () => unsubscribe();
  }, []);

  if (loading) return <Spinner />;

  const getMessageSections = () => {
    const sections = uniq(messages.map(message => message.date));
    return sections.map(section => {
      const data = messages.filter(message => message.date === section);
      return { title: section, data };
    });
  };

  const handleNewMessage = async () => {
    const newMessage: Message = {
      text: message,
      conversationId: '1',
      userId: currentUser.id,
      userName: currentUser.name,
      createdAt: new Date()
    };
    await messageRef.add(newMessage);
    setMessage('');
  };

  const handleChangeText = (text: string) => {
    setMessage(text);
  };

  const renderChatBubble = ({ item }: any) => {
    return (
      <ChatBubble
        text={item.text}
        currentUserMessage={item.id === currentUser.id}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.conversationContainer}>
        <Text>Conversations</Text>
        <SectionList
          sections={getMessageSections()}
          keyExtractor={(item, index) => item + index}
          renderItem={renderChatBubble}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>{title}</Text>
          )}
        />
      </View>
      <View style={styles.chatFooter}>
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
      </View>
    </View>
  );
};

export default ConversationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  conversationContainer: {
    flex: 1
    // alignItems: 'flex-start'
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
    padding: 5
  },
  sectionTitle: {
    textAlign: 'center',
    color: colors.textGrey
  }
});
