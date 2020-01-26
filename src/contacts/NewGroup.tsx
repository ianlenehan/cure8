import React, { useState, useEffect, FunctionComponent } from 'react';
import { View, LayoutAnimation } from 'react-native';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Input, Overlay } from '../common';
import ContactsPickList from './ContactsPickList';
import useBoolean from '../hooks/useBoolean';

const CREATE_GROUP_MUTATION = gql`
  mutation CreateGroup($name: String!, $memberIds: [String!]!) {
    createGroup(name: $name, memberIds: $memberIds) {
      group {
        id
      }
    }
  }
`;

const UPDATE_GROUP_MUTATION = gql`
  mutation UpdateGroup($id: String!, $name: String!, $memberIds: [String!]!) {
    updateGroup(id: $id, name: $name, memberIds: $memberIds) {
      group {
        id
      }
    }
  }
`;

type Props = {
  contacts: any;
  onGroupSaveCompletion: () => void;
  onGroupOverlayClose: () => void;
  selectedGroup?: any;
};

const NewGroup: FunctionComponent<Props> = ({
  contacts,
  onGroupSaveCompletion,
  onGroupOverlayClose,
  selectedGroup
}) => {
  const [name, setName] = useState<string>('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [showingNewGroup, showNewGroup, hideNewGroup] = useBoolean(false);

  useEffect(() => {
    if (selectedGroup) {
      setName(selectedGroup.name);
      handleShow();
      setSelectedContactIds(selectedGroup.memberIds);
    } else {
      setName('');
      setSelectedContactIds([]);
    }
  }, [selectedGroup]);

  const [createGroup, { loading, error }] = useMutation(CREATE_GROUP_MUTATION);
  const [updateGroup] = useMutation(UPDATE_GROUP_MUTATION);

  const handleCancel = () => {
    hideNewGroup();
    onGroupOverlayClose();
  };

  const handleShow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    showNewGroup();
  };

  const handleGroupSave = async () => {
    setName('');
    setSelectedContactIds([]);
    if (selectedGroup) {
      await updateGroup({
        variables: { id: selectedGroup.id, name, memberIds: selectedContactIds }
      });
    } else {
      await createGroup({ variables: { name, memberIds: selectedContactIds } });
    }
    onGroupSaveCompletion();
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
  const saveDisabled = !name || !selectedContactIds.length;

  return (
    <Overlay
      {...{ buttonText, saveDisabled }}
      onSave={handleGroupSave}
      onPress={showNewGroup}
      onCancel={handleCancel}
      isOpen={showingNewGroup}>
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

export default NewGroup;
