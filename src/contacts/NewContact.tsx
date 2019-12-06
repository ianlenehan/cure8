import React, { useState, FunctionComponent } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  LayoutAnimation,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import Contacts, { Contact } from 'react-native-contacts';
import { Button, Input, colors, AppText } from '../common';
import useAppContext from '../hooks/useAppContext';

type Props = {
  navigate: any;
};

const NewContact: FunctionComponent<Props> = ({ navigate }) => {
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
    const contactName = `${contact.givenName} ${contact.familyName}`;
    setNewContact(contact);
    navigate('AddContact', { contactName });
  };

  const renderNames = () => {
    if (!contacts) return null;

    return contacts.map((contact: any) => {
      const name = `${contact.givenName || ''} ${contact.familyName || ''}`;
      return (
        <TouchableOpacity
          key={contact.recordID}
          onPress={() => onContactPress(contact)}>
          <View style={styles.nameView}>
            <AppText size="large">{name}</AppText>
            <Icon
              name="arrow-right"
              type="font-awesome"
              color={colors.textGrey}
            />
          </View>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View
      style={
        isShowing && {
          backgroundColor: colors.primaryGreen,
          padding: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }
      }>
      {isShowing ? (
        <View
          style={{
            height: '75%'
          }}>
          <Button size="small" type="warning" onPress={handleCancel}>
            Close
          </Button>
          <Input
            placeholder="Start typing a name..."
            onChangeText={handleChangeText}
            value={name}
            color="white"
          />
          <ScrollView style={styles.scrollView}>{renderNames()}</ScrollView>
        </View>
      ) : (
        <Button size="medium" onPress={handleNewContactPress}>
          New Contact
        </Button>
      )}
    </View>
  );
};

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
  nameView: {
    backgroundColor: colors.backgroundGrey,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    padding: 10
  },
  scrollView: {
    marginTop: 20
  }
});

export default NewContact;
