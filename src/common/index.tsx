import React, { FunctionComponent } from 'react';
import {
  Image,
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';

const LogoClear = require('../assets/images/logo_clear.png');

export { default as Button } from './Button';
export { default as PhonePicker } from './PhonePicker';
export { default as colors } from './colors';
export { default as Container } from './Container';
export { default as Spinner } from './Spinner';

import colors from './colors';

type AppTextProps = {
  children: any;
  style?: {};
  color?: 'white' | 'black';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
};

export const AppText: FunctionComponent<AppTextProps> = ({
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

type TextProps = {
  color?: string;
  children: any;
  alignText?: string;
  style?: {};
  headerNumber?: 1 | 2 | 3;
};

export const Header: FunctionComponent<TextProps> = ({
  color = 'white',
  children,
  alignText = 'center',
  style = {},
  headerNumber = 1
}) => {
  let fontSize = 42;
  if (headerNumber === 2) fontSize = 30;
  if (headerNumber === 3) fontSize = 24;
  const defaultStyle = {
    fontSize,
    color,
    textAlign: alignText
  };
  return <AppText style={{ ...defaultStyle, ...style }}>{children}</AppText>;
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
    marginLeft: '7.5%',
    marginRight: '7.5%'
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
};

export const InputLabel: FunctionComponent<InputLabelProps> = ({ label }) => {
  return (
    <AppText
      style={{
        color: 'white',
        opacity: 0.8,
        fontSize: 18
      }}>
      {label}
    </AppText>
  );
};

type InputProps = {
  label?: string;
  placeholder?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  error?: boolean;
  white?: boolean;
  onChangeText?: (value: string) => void;
  onChange?: ({  }: any) => void;
  value?: string | undefined;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters' | undefined;
};

export const Input: FunctionComponent<InputProps> = props => {
  let inputColor = props.white ? 'white' : colors.darkerGreen;
  if (Platform.OS === 'android') inputColor = 'rgba(0,0,0,0)';

  const textInputStyle = {
    height: 50,
    flex: 1,
    flexShrink: 0,
    borderColor: inputColor,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    fontSize: 24,
    backgroundColor: inputColor,
    color: props.white ? colors.darkerGreen : 'white'
  };

  return (
    <View style={{ margin: 5 }}>
      {props.label && <InputLabel label={props.label} />}
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
