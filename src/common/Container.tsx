import React, { FunctionComponent } from 'react';
import { View, SafeAreaView } from 'react-native';

import colors from './colors';

type ContainerProps = {
  children: any;
  style?: {};
  color?: 'green' | 'white';
};

const Container: FunctionComponent<ContainerProps> = ({
  children,
  style,
  color = 'green'
}) => {
  const backgroundColor = color === 'white' ? 'white' : colors.primaryGreen;
  const defaultStyle = { flex: 1, backgroundColor };
  return (
    <SafeAreaView style={[defaultStyle, style]}>
      <View style={[defaultStyle, style]}>{children}</View>
    </SafeAreaView>
  );
};

export default Container;
