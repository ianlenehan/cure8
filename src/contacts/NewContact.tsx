import React, { useState, FunctionComponent, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  LayoutAnimation,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet
} from 'react-native';
import Contacts, { Contact } from 'react-native-contacts';
import { Button, Input } from '../common';
import useAppContext from '../hooks/useAppContext';

const styles = StyleSheet.create({
  searchContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    paddingTop: 5
  },
  button: {
    margin: 10
  },
  name: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold'
  }
});

// AIzaSyDl0Q0qE1SzGT04ehppIL77qRVzNTDo7oE

const NewContact: FunctionComponent = ({ navigation }) => {
  const [isShowing, setShowing] = useState(false);
  const [name, setName] = useState('');
  const [contacts, setContacts] = useState();
  const { setNewContact } = useAppContext();

  const handleNewContactPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowing(true);
  };

  const handleCancel = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowing(false);
  };

  const getPhoneContact = (name: string) => {
    Contacts.getContactsMatchingString(name, (err, phoneContacts) => {
      if (err === 'denied') {
        console.log('oops denied');
      } else {
        setContacts(phoneContacts);
      }
    });
  };

  const handleChangeText = (value: string) => {
    setName(value);
    if (value.length > 2) {
      const hasPermission = getPhonePermissions();
      if (hasPermission) getPhoneContact(value);
    } else {
      setContacts([]);
    }
  };

  const getPhonePermissions = async () => {
    // if (Platform.OS === 'android') {
    //   await getAndroidPermissions();
    // }
    getPermissions();
  };

  const getPermissions = () => {
    Contacts.checkPermission((err, permission) => {
      console.log('TCL: getPermissions -> permission', permission);
      if (permission === 'authorized') {
        return true;
      }
      if (permission === 'undefined') {
        Contacts.requestPermission((error, perm) => {
          console.log('contacts request', error, perm);
        });
        return false;
      }
      if (permission === 'denied') {
        Alert.alert(
          'Contacts Permission',
          'You have not granted Cure8 access to your address book. Please enable this in your settings to add your contacts.'
        );
        return false;
      }
    });
  };

  const onContactPress = (contact: any) => {
    console.log('TCL: onContactPress -> contact', contact);
    setNewContact(contact);
    navigation.navigate('AddContact');
    // const { navigate, key } = this.props
    // navigate('addContact', { contact, key })
  };

  const renderNames = () => {
    if (!contacts) return null;

    return contacts.map(contact => {
      const name = `${contact.givenName || ''} ${contact.familyName || ''}`;
      return (
        <TouchableOpacity
          key={contact.recordID}
          onPress={() => onContactPress(contact)}>
          <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View>
      {isShowing ? (
        <View style={{ height: '95%' }}>
          <Button size="small" type="warning" onPress={handleCancel}>
            Cancel
          </Button>
          <Input
            placeholder="Type a name"
            onChangeText={handleChangeText}
            value={name}
            white
          />
          <ScrollView>{renderNames()}</ScrollView>
        </View>
      ) : (
        <View>
          <Button size="medium" onPress={handleNewContactPress}>
            New Contact
          </Button>
        </View>
      )}
    </View>
  );
};

export default NewContact;
