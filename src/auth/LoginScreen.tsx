import React, { Component } from 'react';
import { View, TextInput, LayoutAnimation } from 'react-native';
import firebase from 'react-native-firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import {
  Container,
  PageWrapper,
  Logo,
  Input,
  InputLabel,
  Header,
  Spacer,
  Button,
  AppText
} from '../common';
import PhoneInput from 'react-native-phone-input';

const testPhoneNumber = '+61112223333';
// pin code is 123456

type Props = {};

type State = {
  phoneNumber: string;
  isValid: boolean;
  showCodeField: boolean;
  loading: boolean;
  confirmResult: any;
  otpCode: string;
  error: string | null;
};

type PhoneRefType = {
  isValidNumber: () => boolean;
  getNumberType: () => string;
  getValue: () => string;
};

class LoginScreen extends Component<Props, State> {
  phoneRef: PhoneRefType;
  recaptchaVerifier: any;
  constructor(props: any) {
    super(props);
    this.state = {
      phoneNumber: '',
      isValid: false,
      showCodeField: false,
      loading: false,
      error: null,
      confirmResult: {
        confirm: () => {}
      },
      otpCode: ''
    };

    this.phoneRef = {
      isValidNumber: () => false,
      getNumberType: () => '',
      getValue: () => ''
    };
  }

  onPhoneChange = () => {
    if (!this.phoneRef) return null;
    const type = this.phoneRef.getNumberType();
    const valid = this.phoneRef.isValidNumber();
    const phoneNumber = this.phoneRef.getValue();
    const isValid = phoneNumber === testPhoneNumber || valid;
    this.setState({ phoneNumber, isValid });
  };

  handleGetCode = async () => {
    const { isValid, phoneNumber } = this.state;
    if (isValid) {
      this.setState({ loading: true });
      const confirmResult = await firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ showCodeField: true, loading: false, confirmResult });
    }
  };

  handleVerifyCode = async () => {
    this.setState({ loading: true });
    const { confirmResult, otpCode } = this.state;
    try {
      const user = await confirmResult.confirm(otpCode);
    } catch (error) {
      this.setState({
        error: 'The SMS verification code you entered is invalid.'
      });
    }
    this.setState({ loading: false });
  };

  handleCodeChange = (code: string) => {
    this.setState({ otpCode: code, error: null });
  };

  render() {
    const { phoneNumber, isValid, loading, showCodeField, error } = this.state;
    let label = 'Mobile Number';
    if (phoneNumber.length > 0) {
      label = `Mobile Number - ${phoneNumber}`;
    }

    return (
      <Container>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.keyboardScrollViewStyle}>
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
              onChangePhoneNumber={this.onPhoneChange}
              style={{ width: '100%' }}
              ref={(ref: PhoneRefType) => (this.phoneRef = ref)}
            />
            {showCodeField && (
              <View style={styles.codeInputWrapper}>
                <Spacer size={4} />
                <TextInput
                  keyboardType="number-pad"
                  style={styles.codeInput}
                  onChangeText={this.handleCodeChange}
                />
                <AppText color="white" style={{ textAlign: 'center' }}>
                  Enter One Time Password that was sent to your mobile via SMS.
                </AppText>
              </View>
            )}
            {error && (
              <AppText style={{ fontSize: 14, color: 'red' }}>{error}</AppText>
            )}
            <Spacer size={6} />
            {showCodeField ? (
              <Button
                loading={loading}
                onPress={this.handleVerifyCode}
                bordered>
                Verify Code
              </Button>
            ) : (
              <Button
                loading={loading}
                disabled={!isValid}
                onPress={this.handleGetCode}
                bordered>
                Get Code
              </Button>
            )}
          </PageWrapper>
          <Logo size="large" />
        </KeyboardAwareScrollView>
      </Container>
    );
  }
}

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
