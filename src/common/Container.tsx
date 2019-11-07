import React, { FunctionComponent } from 'react';
import { View, SafeAreaView } from 'react-native';

import colors from './colors';

type ContainerProps = {
  children: any;
  style?: {};
};

const Container: FunctionComponent<ContainerProps> = ({ children, style }) => {
  const defaultStyle = { flex: 1, backgroundColor: colors.primaryGreen };
  return (
    <SafeAreaView style={defaultStyle}>
      <View style={[defaultStyle, style]}>{children}</View>
    </SafeAreaView>
  );
};

export default Container;
