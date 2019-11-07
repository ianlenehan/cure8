import React, { FunctionComponent } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import colors from './colors';

type Props = {
  size?: 'small' | 'large';
  text?: string;
};

const Spinner: FunctionComponent<Props> = ({ size, text }) => {
  return (
    <View style={styles.spinnerStyle}>
      <ActivityIndicator size={size || 'large'} color={colors.primaryGreen} />
      {text && <Text>{text}</Text>}
    </View>
  );
};

export default Spinner;

const styles = StyleSheet.create({
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
