import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { ListItem, Divider } from 'react-native-elements';
import CountryPicker, {
  CountryCode,
  getCallingCode
} from 'react-native-country-picker-modal';
import {
  NavigationStackScreenComponent,
  NavigationStackScreenProps
} from 'react-navigation-stack';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { AppText, Input } from '../common';

import useAppContext from '../hooks/useAppContext';

const CREATE_CONTACT_MUTATION = gql`
  mutation CreateContact($name: String!, $phone: String!) {
    createContact(name: $name, phone: $phone) {
      contacts {
        id
        name
        user {
          id
          name
        }
        linkedUser {
          id
          name
          phone
        }
      }
    }
  }
`;

type PhoneNumbers = {
  number: string;
  label: string;
};

const AddContactScreen: NavigationStackScreenComponent<NavigationStackScreenProps> = ({
  navigation
}) => {
  const [callingCode, setCallingCode] = useState('');
  const [countryCode, setCountryCode] = useState<CountryCode>();

  const { newContact } = useAppContext();

  const { familyName, givenName, phoneNumbers } = newContact;
  const name = `${givenName} ${familyName}`;

  useEffect(() => {
    getUserLocation();
  }, []);

  const [createContact, { loading, error, data }] = useMutation(
    CREATE_CONTACT_MUTATION
  );

  console.log('TCL: CreateContact data', data);

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(info => {
      const coords = [info.coords.latitude, info.coords.longitude];
      getCountryCode(coords);
    });
  };

  const getCountryCode = async (coords: number[]) => {
    const [lat, long] = coords;
    const countryCodeRes = await fetch(
      `http://localhost:3000/country?lat=${lat}&long=${long}`
    );
    const codeJson = await countryCodeRes.json();
    const code = codeJson.results.toUpperCase();
    const callingCode = await getCallingCode(code);

    setCallingCode(callingCode);
    setCountryCode(code);
  };

  // const getCallingCode = async () => {

  //   // this.props.saveContact(name, cleanNumber, this.state.token)
  //   // navigation.goBack();
  // };

  const handleAddPress = async (name: string, number: string) => {
    const phone = formatNumber(number);
    const { data } = await createContact({
      variables: { name, phone }
    });
    if (data) {
      navigation.goBack();
    }
  };

  const handleCountryChange = (data: any) => {
    setCallingCode(data.callingCode);
    setCountryCode(data.cca2);
  };

  const numberLabel = (label: string) => {
    return label || 'phone';
  };

  const formatNumber = (number: string) => {
    const fullNumber = number.split('')[0] === '+';

    const numbersOnly = Number(number.replace(/[^\d]/g, ''));
    if (fullNumber) {
      const n = `${removeParenthesesFromFull(number)}`;
      return `+${Number(n.replace(/[^\d]/g, ''))}`;
    }
    return `+${callingCode}${numbersOnly}`;
  };

  const removeParenthesesFromFull = (number: string) => {
    return number.replace(/\(0\)/g, '').replace(/ /g, '');
  };

  const renderCountryPicker = () => {
    if (!countryCode) return null;

    const note =
      'Country code selected below only applies if ' +
      'the phone number chosen does not begin with +';

    return (
      <View style={styles.pickerView}>
        <AppText size="medium">Choose Country Code:</AppText>
        <CountryPicker
          countryCode={countryCode}
          withFlag
          withCallingCodeButton
          withCallingCode
          withEmoji
          onSelect={handleCountryChange}
        />
      </View>
    );
  };

  return (
    <View>
      {renderCountryPicker()}
      <Divider />
      <ScrollView>
        <View style={{ marginBottom: 20 }}>
          {phoneNumbers.map((number: PhoneNumbers) => (
            <ListItem
              key={number.number}
              title={number.number}
              subtitle={numberLabel(number.label)}
              rightIcon={{ name: 'plus', type: 'font-awesome' }}
              onPress={() => handleAddPress(name, number.number)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AddContactScreen;

const styles = StyleSheet.create({
  flagStyle: {
    width: 50,
    height: 30
  },
  pickerView: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around',
    alignItems: 'center'
  }
});
