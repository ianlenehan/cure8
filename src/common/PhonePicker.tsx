import React from 'react';
import { View, TextInput } from 'react-native';
import PhoneInput from 'react-native-phone-input';

const PhonePicker = () => {
  return (
    <View>
      <PhoneInput />
      <TextInput></TextInput>
    </View>
  );
};

export default PhonePicker;
