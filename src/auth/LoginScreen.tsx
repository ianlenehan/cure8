import React, { FC, useState, useRef } from 'react';
import { View, TextInput, LayoutAnimation } from 'react-native';
import auth from '@react-native-firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import PhoneInput, { ReactNativePhoneInputProps } from 'react-native-phone-input';

import { Container, PageWrapper, Logo, Input, InputLabel, Header, Spacer, Button, AppText } from '../common';
import useBoolean from '../hooks/useBoolean';

const testPhoneNumber = '+611112223333';
// pin code is 123456

const LoginScreen: FC = () => {
  const [confirm, setConfirm] = useState<any>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');

  const [loading, startLoading, cancelLoading] = useBoolean(false);

  const phoneRef = useRef<any>(null);

  const handlePhoneChange = () => {
    if (!phoneRef || !phoneRef.current) return null;
    const ref = phoneRef.current;

    const valid = ref.isValidNumber();
    const number = ref.getValue();
    const isValid = phoneNumber === testPhoneNumber || valid;

    setPhoneNumber(number);
    setIsValid(isValid);
  };

  const handleGetCode = async () => {
    if (isValid) {
      startLoading();
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setConfirm(confirmation);
      cancelLoading();
    }
  };

  const handleVerifyCode = async () => {
    startLoading();
    try {
      await confirm.confirm(otpCode);
    } catch (err) {
      setError(`'The SMS verification code you entered is invalid.' ${err}`);
    }
    cancelLoading();
  };

  const handleCodeChange = (code: string) => {
    setOtpCode(code);
    setError('');
  };

  const renderCodeInput = () => {
    if (!confirm) {
      return null;
    }

    return (
      <View style={styles.codeInputWrapper}>
        <Spacer size={4} />
        <TextInput keyboardType="number-pad" style={styles.codeInput} onChangeText={handleCodeChange} />
        <AppText color="white" style={{ textAlign: 'center' }}>
          Enter One Time Password that was sent to your mobile via SMS.
        </AppText>
      </View>
    );
  };

  const renderButton = () => {
    if (confirm) {
      return (
        <Button {...{ loading }} onPress={handleVerifyCode} bordered>
          Verify Code
        </Button>
      );
    }

    return (
      <Button {...{ loading }} disabled={!isValid} onPress={handleGetCode} bordered>
        Get Code
      </Button>
    );
  };

  let label = 'Mobile Number';
  if (phoneNumber.length > 0) {
    label = `Mobile Number - ${phoneNumber}`;
  }

  return (
    <Container>
      <KeyboardAwareScrollView contentContainerStyle={styles.keyboardScrollViewStyle}>
        <PageWrapper>
          <Spacer size={2} />
          <Header color="white">Login</Header>
          <Spacer size={4} />
          <InputLabel label={label} color="white" />
          <PhoneInput
            initialCountry="au"
            flagStyle={styles.flagStyle}
            textComponent={Input}
            allowZeroAfterCountryCode={false}
            onChangePhoneNumber={handlePhoneChange}
            style={{ width: '100%' }}
            ref={phoneRef}
          />

          {renderCodeInput()}

          {!!error && <AppText style={{ fontSize: 14, color: 'red' }}>{error}</AppText>}

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
