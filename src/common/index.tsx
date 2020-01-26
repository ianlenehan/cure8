import React, { FunctionComponent } from 'react';
import {
  Image,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import colors from './colors';
import AppText from './AppText';

const LogoClear = require('../assets/images/logo_clear.png');

export { default as Button } from './Button';
export { default as PhonePicker } from './PhonePicker';
export { default as colors } from './colors';
export { default as Container } from './Container';
export { default as Spinner } from './Spinner';
export { default as AppText } from './AppText';
export { default as Header } from './Header';
export { default as Tag } from './Tag';
export { default as TagContainer } from './TagContainer';
export { default as ContactRow } from './ContactRow';
export { default as Overlay } from './Overlay';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
};

export const Logo: FunctionComponent<LogoProps> = ({ size }) => {
  let style = { width: 100, height: 30 }; // small size
  switch (size) {
    case 'medium':
      style = { width: 200, height: 60 };
      break;
    case 'large':
      style = { width: 250, height: 75 };
      break;
    default:
      style = style;
  }
  return <Image style={style} resizeMode="contain" source={LogoClear} />;
};

type PageWrapperProps = {
  children: any;
  style?: {};
};

export const PageWrapper: FunctionComponent<PageWrapperProps> = ({
  children,
  style
}) => {
  const baseStyle = {
    marginLeft: '3%',
    marginRight: '3%'
  };
  return <View style={[baseStyle, style]}>{children}</View>;
};

type SpacerProps = {
  size?: number;
};

export const Spacer: FunctionComponent<SpacerProps> = ({ size = 1 }) => {
  const height = size * 10;
  return <View style={{ height }} />;
};

type InputLabelProps = {
  label: string;
  color?: 'white' | 'grey';
};

export const InputLabel: FunctionComponent<InputLabelProps> = ({
  label,
  color
}) => {
  return (
    <AppText
      style={{
        color: color || colors.textGrey,
        opacity: 0.8,
        fontSize: 18
      }}>
      {label}
    </AppText>
  );
};

type InputProps = {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
  bordered?: boolean;
  buttonText?: string;
  error?: boolean;
  label?: string;
  onButtonPress?: () => void;
  onChange?: ({}: any) => void;
  onChangeText?: (value: string) => void;
  placeholder?: string;
  value?: string | undefined;
  color?: 'green' | 'grey' | 'white';
  small?: boolean;
};

export const Input: FunctionComponent<InputProps> = props => {
  let backgroundColor = colors.darkerGreen;
  let textColor = 'white';

  if (props.color === 'white') {
    backgroundColor = 'white';
    textColor = colors.textGrey;
  }
  if (props.color === 'grey') {
    backgroundColor = colors.backgroundGrey;
    textColor = colors.textGrey;
  }

  const labelColor = props.color === 'white' ? 'white' : 'grey';

  // if (Platform.OS === 'android') backgroundColor = 'rgba(0,0,0,0)';

  const borderedStyle = props.bordered
    ? { borderWidth: 1, borderColor: '#bdc3c7' }
    : {};

  const textInputStyle = {
    height: props.small ? 35 : 45,
    flex: 1,
    flexShrink: 0,
    padding: 10,
    borderRadius: 5,
    fontSize: props.small ? 16 : 20,
    backgroundColor,
    color: textColor,
    ...borderedStyle
  };

  return (
    <View style={{ margin: 5 }}>
      {props.label && <InputLabel label={props.label} color={labelColor} />}
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <TextInput {...props} style={textInputStyle} />
        {props.buttonText && (
          <TouchableOpacity
            style={{
              padding: 10,
              height: 50,
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              display: 'flex',
              justifyContent: 'center'
            }}
            onPress={props.onButtonPress}>
            <AppText
              style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center' as const
              }}>
              {props.buttonText}
            </AppText>
          </TouchableOpacity>
        )}
      </View>
      {props.error && (
        <AppText style={{ fontSize: 14, color: 'red' }}>{props.error}</AppText>
      )}
    </View>
  );
};

type LoadingProps = {
  size?: number | 'large' | 'small' | undefined;
  invert?: boolean;
};

export const Loading: FunctionComponent<LoadingProps> = ({
  size = 'large',
  invert
}) => {
  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <ActivityIndicator
        size={size}
        color={invert ? 'white' : colors.primaryGreen}
      />
    </View>
  );
};
