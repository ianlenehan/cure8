import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, AppText } from '../common';

type Props = {
  currentUserMessage: boolean;
  text: string;
  time: string;
  userName: string;
};

const ChatBubble = ({ currentUserMessage, text, time, userName }: Props) => {
  const backgroundColor = currentUserMessage
    ? colors.primaryGreen
    : colors.tertiaryBlue;

  return (
    <View
      style={{
        alignItems: currentUserMessage ? 'flex-end' : 'flex-start',
        flex: 1
      }}>
      <View style={[{ backgroundColor }, styles.bubble]}>
        {userName && (
          <AppText color={colors.backgroundGrey}>{userName}</AppText>
        )}
        <AppText color="white" style={styles.text}>
          {text}
        </AppText>
        <AppText align="right" color={colors.backgroundGrey}>
          {time}
        </AppText>
      </View>
    </View>
  );
};

export default ChatBubble;

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '65%',
    minWidth: '35%',
    borderRadius: 12,
    padding: 8,
    margin: 5
  },
  text: {
    fontSize: 14
  }
});
