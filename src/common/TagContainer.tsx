import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  children: any;
  showBorder?: boolean;
};

const TagContainer: FC<Props> = props => {
  const borderStyle = props.showBorder ? styles.border : {};

  return (
    <View style={[styles.tagContainer, borderStyle]}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  border: {
    borderTopWidth: 1,
    borderColor: '#dcdcdc',
    marginTop: 5,
    paddingTop: 5
  }
});

export default TagContainer;
