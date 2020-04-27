import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

import { colors } from '../common';

import { ConversationType, UserType } from './types';

const ConversationItem = ({
  conversation
}: {
  conversation: ConversationType;
}) => {
  console.log('conversation', conversation);
  const users = useMemo(() => {
    return conversation.users.map((user: UserType) => {
      const [firstName, secondName] = user.name.split(' ');
      const lastInitial = secondName ? secondName.slice(0, 1) : '';
      return `${firstName} ${lastInitial}`;
    });
  }, [conversation.users]);

  const formatDate = (date: string) => {
    const currentDate = new Date();
    return moment(date)
      .local()
      .from(currentDate);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{conversation.title}</Text>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{users.join(', ')}</Text>
        <Text style={styles.footerText}>
          {formatDate(conversation.updatedAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomColor: colors.backgroundGrey,
    borderBottomWidth: 1
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
