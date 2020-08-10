import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

import { colors } from '../common';

import { ConversationType, UserType } from './types';

type Props = {
  conversation: ConversationType;
  onPress: (conversationId: string) => void;
};

const ConversationItem = ({ conversation, onPress }: Props) => {
  const users = useMemo(() => {
    const conversationUsers = conversation.users.map((user: UserType) => {
      const [firstName, secondName] = user.name.split(' ');
      const lastInitial = secondName ? secondName.slice(0, 1) : '';
      return `${firstName} ${lastInitial}`;
    });
    return conversationUsers.join(', ');
  }, [conversation.users]);

  const handlePress = () => onPress(conversation.id);

  const formatDate = (date: string) => {
    const currentDate = new Date();
    return moment(date)
      .local()
      .from(currentDate);
  };

  return (
    <TouchableOpacity style={styles.wrapper} onPress={handlePress}>
      <Text style={styles.title}>{conversation.title}</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{users}</Text>
        <Text style={styles.footerText}>
          {formatDate(conversation.updatedAt)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    marginBottom: 0,
    borderRadius: 5
  },
  title: {
    fontSize: 16
  },
  footer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10
  },
  footerText: {
    color: colors.textGrey,
    fontSize: 13
  }
});

export default ConversationItem;
