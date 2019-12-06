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
  size,
  color
}) => {
  let fontSize = 12;
  if (size === 'medium') fontSize = 16;
  if (size === 'large') fontSize = 20;
  if (size === 'xlarge') fontSize = 24;

  let textColor = colors.textGrey;
  if (color === 'white') textColor = 'white';

  return (
    <Text
      style={[
        {
          fontFamily: 'KohinoorBangla-Semibold',
          color: textColor,
          fontSize
        },
        style
      ]}>
      {children}
    </Text>
  );
};

export default AppText;
