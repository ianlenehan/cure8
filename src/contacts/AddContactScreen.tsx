import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { Divider, Icon } from 'react-native-elements';
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

import { AppText, colors, ContactRow } from '../common';

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

// TODO export this as it's here twice now
const FETCH_CONTACTS = gql`
  query contacts {
    contacts {
      id
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

  const [createContact, { data, loading, error }] = useMutation(
    CREATE_CONTACT_MUTATION,
    {
      refetchQueries: [{ query: FETCH_CONTACTS }]
    }
  );

  useEffect(() => {
    if (data && navigation.state.params) {
      navigation.state.params.onContactSave();
      navigation.goBack();
    }
  }, [data]);

  const getUserLocation = () => {
    try {
      Geolocation.getCurrentPosition(info => {
        const coords = [info.coords.latitude, info.coords.longitude];
        getCountryCode(coords);
      });
    } catch (error) {
      console.error('There was an error with geolocation', error);
    }
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
    createContact({
      variables: { name, phone }
    });
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

  const AddIcon = ({ name, number }: { name: string; number: string }) => {
    const onPress = () => handleAddPress(name, number);

    return (
      <Icon
        name="plus"
        type="font-awesome"
        color={colors.primaryGreen}
        onPress={onPress}
        reverse
        disabled={!countryCode}
        size={18}
      />
    );
  };

  return (
    <View>
      {renderCountryPicker()}
      <Divider />
      <ScrollView>
        <View style={{ marginBottom: 20 }}>
          {phoneNumbers.map((number: PhoneNumbers) => (
            <ContactRow
              key={number.number}
              title={number.number}
              subtitle={numberLabel(number.label)}
              rightIcon={<AddIcon name={name} number={number.number} />}
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
