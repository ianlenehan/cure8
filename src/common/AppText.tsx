import React, { FunctionComponent } from 'react';
import { Text } from 'react-native';

import colors from './colors';

type AppTextProps = {
  children: any;
  style?: {};
  color?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  align?: 'left' | 'center' | 'right';
};

const AppText: FunctionComponent<AppTextProps> = ({
  children,
  style,
  size,
  color,
  align = 'left'
}) => {
  let fontSize = 12;
  if (size === 'medium') fontSize = 16;
  if (size === 'large') fontSize = 20;
  if (size === 'xlarge') fontSize = 28;

  const textColor = color || colors.textGrey;

  return (
    <Text
      style={[
        {
          fontFamily: 'KohinoorBangla-Semibold',
          color: textColor,
          fontSize,
          textAlign: align
        },
        style
      ]}>
      {children}
    </Text>
  );
};

export default AppText;
