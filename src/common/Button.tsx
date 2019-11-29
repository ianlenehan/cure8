import React, { FunctionComponent } from 'react';
import { TouchableOpacity } from 'react-native';

import colors from './colors';
import { Loading, AppText } from './index';

type ButtonProps = {
  type?: 'primary' | 'secondary' | 'tertiary' | 'warning';
  onPress: () => void;
  loading?: boolean;
  style?: {};
  textStyle?: {};
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  raised?: boolean;
};

const getColor = (type: ButtonProps['type']) => {
  let color = colors.primaryGreen;
  if (type === 'secondary') {
    color = colors.secondaryPink;
  }
  if (type === 'tertiary') {
    color = colors.tertiaryBlue;
  }
  if (type === 'warning') {
    color = colors.warningRed;
  }
  return color;
};

const getSize = (size: ButtonProps['size']) => {
  let height = 65;
  let fontSize = 22;

  if (size === 'medium') {
    height = 45;
    fontSize = 18;
  }
  if (size === 'small') {
    height = 35;
    fontSize = 16;
  }

  return { height, fontSize };
};

const Button: FunctionComponent<ButtonProps> = props => {
  const backgroundColor = getColor(props.type);
  const { height, fontSize } = getSize(props.size);

  let onPress = props.onPress;
  if (props.loading || props.disabled) onPress = () => {};

  const raisedStyle = props.raised
    ? {
        shadowColor: 'black',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: props.disabled ? 0 : 0.4,
        elevation: 8,
        shadowRadius: 10
      }
    : {};

  return (
    <TouchableOpacity
      style={{
        backgroundColor,
        borderRadius: 5,
        height,
        justifyContent: 'center',
        margin: 5,
        ...raisedStyle,
        ...props.style
      }}
      onPress={onPress}
      {...props}>
      {props.loading ? (
        <Loading size="small" invert />
      ) : (
        <AppText
          style={{
            color: props.disabled ? colors.darkerGreen : 'white',
            fontSize,
            textAlign: 'center' as const,
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontFamily: 'KohinoorBangla-Semibold',
            ...props.textStyle
          }}>
          {props.children}
        </AppText>
      )}
    </TouchableOpacity>
  );
};

export default Button;
