import React, { useState, useRef } from 'react';
import { View, TextInput, LayoutAnimation } from 'react-native';
import axios from 'axios';
import * as RNLocalize from 'react-native-localize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PhoneInput from 'react-native-phone-input';
import auth from '@react-native-firebase/auth';

import { Container, PageWrapper, Logo, Input, InputLabel, Header, Spacer, Button, AppText } from '@cure8/common';
import useBoolean from '@cure8/hooks/useBoolean';

import { rootURL } from '../../env';
import useFirestore from '@cure8/hooks/useFirestore';

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

  const { firestore, getDocument } = useFirestore()

  const phoneRef = useRef<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, startLoading, stopLoading] = useBoolean(false);
  const [error, setError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [confirm, setConfirm] = useState<any>(null);

  const handlePhoneChange = () => {
    if (!phoneRef.current) return null;
    const type = phoneRef.current.getNumberType();
    const fullPhone = phoneRef.current.getValue();
    const valid = fullPhone === testPhoneNumber || phoneRef.current.isValidNumber();
    setPhoneNumber(fullPhone);

    if (valid) {
      setIsValid(fullPhone === testPhoneNumber || valid);
    }

    if (['MOBILE', 'FIXED_LINE_OR_MOBILE'].includes(type)) {
      setError('');
    } else {
      setError('Phone number must be a mobile number that can receive SMS');
    }
  };

  const handleGetCode = async () => {
    if (isValid) {
      startLoading();
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      stopLoading();
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setConfirm(confirmation);
    }
  };

  const handleVerifyCode = async () => {
    startLoading()
    try {
      const confirmResult = await confirm.confirm(otpCode);
      
      const authUser = confirmResult.user;
      const docRef = firestore().collection('users').doc(authUser.uid)
      const user = await getDocument(docRef)

      if (user.exists) {
        // log user in
      }
      stopLoading()
    } catch (error) {
      stopLoading()
      setError(`'The SMS verification code you entered is invalid.' ${error}`);
    }
  }

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
    if (confirm) {
      return (
        <Button loading={loading} onPress={handleVerifyCode} bordered>
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
          <Spacer />
          <AppText align="center" color="white">Enter your phone number below to login to an existing account or to create a new account.</AppText>
          <Spacer size={4} />
          <InputLabel label={label} color="white" />
          <PhoneInput
            initialCountry={'au'}
            flagStyle={styles.flagStyle}
            textComponent={Input}
            allowZeroAfterCountryCode={false}
            onChangePhoneNumber={handlePhoneChange}
            style={{ width: '100%' }}
            ref={phoneRef}
          />
          {!!confirm && (
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
