import React, { useState, useEffect, FunctionComponent } from 'react';
import { View, StyleSheet } from 'react-native';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import Overlay from './Overlay';
import { Input, colors } from '../common';
import ContactsPickList from './ContactsPickList';

const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($name: String!, $memberIds: [String!]!) {
    createGroup(name: $name, memberIds: $memberIds) {
      group {
        id
      }
    }
  }
`;

type Props = {
  navigate: any;
  contacts: any;
  onCreateGroupCompletion: () => void;
  onGroupOverlayClose: () => void;
  selectedGroup?: any;
};

const NewGroup: FunctionComponent<Props> = ({
  navigate,
  contacts,
  onCreateGroupCompletion,
  onGroupOverlayClose,
  selectedGroup
}) => {
  const [name, setName] = useState<string>('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  useEffect(() => {
    if (selectedGroup) {
      setName(selectedGroup.name);
      setSelectedContactIds(selectedGroup.memberIds);
    } else {
      setName('');
      setSelectedContactIds([]);
    }
  }, [selectedGroup]);

  const [createGroup, { loading, error }] = useMutation(CREATE_GROUP_MUTATION);

  const handleGroupSave = async () => {
    setName('');
    setSelectedContactIds([]);
    await createGroup({ variables: { name, memberIds: selectedContactIds } });
    onCreateGroupCompletion();
  };

  // const handleChangeText = (value: string) => {
  //   setName(value);
  //   if (value.length > 2) {
  //     const hasPermission = getPhonePermissions();
  //     if (hasPermission) getPhoneContact(value);
  //   } else {
  //     setContacts([]);
  //   }
  // };

  const handleContactPress = (contactId: string) => {
    if (selectedContactIds.includes(contactId)) {
      const otherContacts = selectedContactIds.filter(c => c !== contactId);
      setSelectedContactIds(otherContacts);
    } else {
      setSelectedContactIds(prevState => [...prevState, contactId]);
    }
  };

  const buttonText = selectedGroup ? 'Edit Group' : 'New Group';

  return (
    <Overlay
      {...{ buttonText }}
      onClose={onGroupOverlayClose}
      onSave={handleGroupSave}
      isOpen={!!selectedGroup}>
      <View>
        <Input
          placeholder="Group name"
          onChangeText={setName}
          value={name}
          color="white"
        />
        {/* <ScrollView style={styles.scrollView}> */}
        <ContactsPickList
          onPress={handleContactPress}
          selectedContactIds={selectedContactIds}
          contacts={contacts}
          editMode={false}
        />
        {/* </ScrollView> */}
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

export default NewGroup;
