import React, { FunctionComponent } from 'react';

import colors from './colors';
import AppText from './AppText';

type TextProps = {
  color?: string;
  children: any;
  alignText?: string;
  style?: {};
  headerNumber?: 1 | 2 | 3 | 4;
};

const Header: FunctionComponent<TextProps> = ({
  color = colors.textGrey,
  children,
  alignText = 'center',
  style = {},
  headerNumber = 1
}) => {
  let fontSize = 42;
  if (headerNumber === 2) fontSize = 30;
  if (headerNumber === 3) fontSize = 24;
  if (headerNumber === 4) fontSize = 18;
  const defaultStyle = {
    fontSize,
    color,
    textAlign: alignText
  };
  return <AppText style={{ ...defaultStyle, ...style }}>{children}</AppText>;
};

export default Header;
