import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../common';

type Props = {
  currentUserMessage: boolean;
  text: string;
};

const ChatBubble = ({ currentUserMessage, text }: Props) => {
  const backgroundColor = currentUserMessage
    ? colors.primaryGreen
    : colors.backgroundGrey;

  return (
    <View
      style={{ alignItems: currentUserMessage ? 'flex-end' : 'flex-start' }}>
      <View style={[{ backgroundColor }, styles.bubble]}>
        <Text>{text}</Text>
      </View>
    </View>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '65%',
    borderRadius: 12,
    padding: 8,
    margin: 5
  }
});
