import React, { useState, useRef } from 'react';
import { View, TextInput, LayoutAnimation } from 'react-native';
import axios from 'axios';
import * as RNLocalize from 'react-native-localize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PhoneInput from 'react-native-phone-input';

import { Container, PageWrapper, Logo, Input, InputLabel, Header, Spacer, Button, AppText } from '../common';

import useBoolean from '../hooks/useBoolean';

import { rootURL } from '../../env';

const apiUrl = `${rootURL}api/v1/`;

const testPhoneNumber = '+61112223333';
// pin code is 123456

type User = {
  id: string;
  phone: string;
};

type Props = {
  registrationRequired: boolean;
  setCurrentUser: (user: User) => void;
  setRegistrationRequired: (registrationRequired: boolean) => void;
  setToken: (token: string) => void;
};

const LoginScreen = (props: Props) => {
  const { registrationRequired, setCurrentUser, setRegistrationRequired, setToken } = props;

  const phoneRef = useRef<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showingCodeField, showCodeField] = useBoolean(false);
  const [isValid, setIsValid] = useState(false);
  const [loading, startLoading, stopLoading] = useBoolean(false);
  const [error, setError] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const handlePhoneChange = () => {
    if (!phoneRef.current) return null;
    const type = phoneRef.current.getNumberType();
    const valid = phoneRef.current.isValidNumber();
    const fullPhone = phoneRef.current.getValue();

    if (valid) {
      setIsValid(fullPhone === testPhoneNumber || valid);
    }

    if (['MOBILE', 'FIXED_LINE_OR_MOBILE'].includes(type)) {
      setError('');
      setPhoneNumber(fullPhone);
    } else {
      setError('Phone number must be a mobile number that can receive SMS');
    }
  };

  const handleGetCode = async () => {
    if (isValid) {
      startLoading();
      try {
        const res = await axios.post(`${apiUrl}request_password`, {
          phone: phoneNumber
        });

        setRegistrationRequired(res.data.registration_required);
        setError('');
        showCodeField();
      } catch (error) {
        console.error('handleGetCode -> error', error);
        setError(error.message);
      }

      stopLoading();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  };

  const handleLogin = async () => {
    startLoading();
    try {
      const res = await axios.post(`${apiUrl}authenticate`, {
        phone: phoneNumber,
        code: otpCode
      });
      stopLoading();
      setCurrentUser(res.data.current_user);
      setToken(res.data.auth_token);
    } catch (error) {
      console.log('handleLogin -> error', error);
      setError('The SMS verification code you entered is invalid.');
      stopLoading();
    }
  };

  const handleCodeChange = (code: string) => {
    setError('');
    setOtpCode(code);
  };

  const renderButton = () => {
    if (showingCodeField) {
      return (
        <Button loading={loading} onPress={handleLogin} bordered>
          {registrationRequired ? 'Create Account' : 'Login'}
        </Button>
      );
    }

    return (
      <Button loading={loading} disabled={!isValid} onPress={handleGetCode} bordered>
        Get Code
      </Button>
    );
  };

  const renderError = () => {
    if (!error) return null;

    return (
      <AppText
        style={{
          fontSize: 14,
          color: 'red',
          textAlign: 'center',
          margin: 25
        }}>
        {error}
      </AppText>
    );
  };

  let label = 'Mobile Number';
  if (phoneNumber.length > 0) {
    label = `Mobile Number - ${phoneNumber}`;
  }

  const [locale] = RNLocalize.getLocales();
  const { countryCode } = locale;

  return (
    <Container>
      <KeyboardAwareScrollView contentContainerStyle={styles.keyboardScrollViewStyle}>
        <PageWrapper>
          <Spacer size={2} />
          <Header color="white">Login</Header>
          <Spacer size={4} />
          <InputLabel label={label} color="white" />
          <PhoneInput
            initialCountry={countryCode.toLowerCase()}
            flagStyle={styles.flagStyle}
            textComponent={Input}
            allowZeroAfterCountryCode={false}
            onChangePhoneNumber={handlePhoneChange}
            style={{ width: '100%' }}
            ref={phoneRef}
          />
          {!!showingCodeField && (
            <View style={styles.codeInputWrapper}>
              <Spacer size={4} />
              <TextInput keyboardType="number-pad" style={styles.codeInput} onChangeText={handleCodeChange} />
              <AppText color="white" style={{ textAlign: 'center' }}>
                Enter One Time Password that was sent to your mobile via SMS.
              </AppText>
            </View>
          )}
          {renderError()}
          <Spacer size={6} />

          {renderButton()}
        </PageWrapper>
        <Logo size="large" />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default LoginScreen;

const styles = {
  keyboardScrollViewStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1
  },
  codeInputWrapper: { marginLeft: 20, marginRight: 20 },
  codeInput: {
    textAlign: 'center' as const,
    fontSize: 48,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 20,
    color: 'white'
  },
  flagStyle: {
    width: 50,
    height: 30
  }
};
