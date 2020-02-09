import React, { FunctionComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';

type Props = {
  children?: any;
  text?: string;
};

const EmptyPage: FunctionComponent<Props> = props => {
  return (
    <View style={styles.container}>
      <AppText size="large">{props.text}</AppText>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
});

export default EmptyPage;
