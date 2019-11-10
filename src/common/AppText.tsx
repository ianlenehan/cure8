import React, { FunctionComponent } from 'react';
import { Text } from 'react-native';

import colors from './colors';

type AppTextProps = {
  children: any;
  style?: {};
  color?: 'white' | 'black';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
};

const AppText: FunctionComponent<AppTextProps> = ({
  children,
  style,
  size
}) => {
  let fontSize = 12;
  if (size === 'medium') fontSize = 16;
  if (size === 'large') fontSize = 20;
  if (size === 'xlarge') fontSize = 24;
  return (
    <Text
      style={[
        {
          fontFamily: 'KohinoorBangla-Semibold',
          color: colors.textGrey,
          fontSize
        },
        style
      ]}>
      {children}
    </Text>
  );
};

export default AppText;
