import React, { useState, FunctionComponent } from 'react';
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';
import { Icon } from 'react-native-elements';
import Contacts, { Contact } from 'react-native-contacts';

import { Input, Overlay, colors, AppText } from '../common';
import useAppContext from '../hooks/useAppContext';
import useBoolean from '../hooks/useBoolean';

type Props = {
  navigate: any;
};

const NewContact: FunctionComponent<Props> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [contacts, setContacts] = useState();
  const [showingNewContact, showNewContact, hideNewContact] = useBoolean(false);
  const { setNewContact } = useAppContext();

  const handleContactSave = () => {
    setName('');
    setContacts([]);
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

  const handleContactPress = (contact: any) => {
    const contactName = `${contact.givenName} ${contact.familyName}`;
    setNewContact(contact);
    navigate('AddContact', { contactName, onContactSave: handleContactSave });
  };

  const renderNames = () => {
    if (!contacts) return null;

    return contacts.map((contact: any) => {
      const name = `${contact.givenName || ''} ${contact.familyName || ''}`;
      const onPress = () => handleContactPress(contact);
      return (
        <TouchableOpacity key={contact.recordID} onPress={onPress}>
          <View style={styles.nameView}>
            <AppText size="large" color="black">
              {name}
            </AppText>
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
    <Overlay
      buttonText="New Contact"
      isOpen={showingNewContact}
      onPress={showNewContact}
      onCancel={hideNewContact}>
      <View>
        <Input
          placeholder="Start typing a name..."
          onChangeText={handleChangeText}
          value={name}
          color="white"
        />
        <ScrollView style={styles.scrollView}>{renderNames()}</ScrollView>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  nameView: {
    backgroundColor: 'white',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    padding: 10,
    borderColor: colors.textGrey,
    borderWidth: 1
  },
  scrollView: {
    marginTop: 20
  }
});

export default NewContact;
