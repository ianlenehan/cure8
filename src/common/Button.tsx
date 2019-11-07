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
};

const Button: FunctionComponent<ButtonProps> = props => {
  let primaryColor = colors.primaryGreen;
  let altColor = 'white';
  let borderColor = props.disabled ? colors.darkerGreen : altColor;
  let invert = true;
  if (props.type === 'secondary') {
    primaryColor = colors.secondaryPink;
    borderColor = primaryColor;
  }
  if (props.type === 'tertiary') {
    primaryColor = colors.tertiaryBlue;
    borderColor = primaryColor;
  }
  if (props.type === 'warning') {
    primaryColor = 'red';
  }
  let onPress = props.onPress;
  if (props.loading || props.disabled) onPress = () => {};
  return (
    <TouchableOpacity
      style={{
        height: 65,
        margin: 5,
        borderColor: borderColor,
        backgroundColor: primaryColor,
        borderRadius: 5,
        borderWidth: 1,
        shadowOffset: { width: 4, height: 7 },
        shadowColor: 'black',
        shadowOpacity: props.disabled ? 0 : 0.1,
        justifyContent: 'center',
        ...props.style
      }}
      onPress={onPress}
      {...props}>
      {props.loading ? (
        <Loading size="small" invert={invert} />
      ) : (
        <AppText
          style={{
            color: props.disabled ? colors.darkerGreen : altColor,
            fontSize: 22,
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
