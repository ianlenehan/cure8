import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useMutation, useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

import useContacts from '@cure8/hooks/useContacts';
import useForm from '../hooks/useForm';
import useToast from '../hooks/useToast';
import useBoolean from '../hooks/useBoolean';
import { Input, Spacer, Overlay, Spinner, colors } from '../common';
import validate from './validate';
import ContactsPickList from '../contacts/ContactsPickList';

import useApi from './useApi';

// const FETCH_CONTACTS_AND_GROUPS = gql`
//   query contactsAndGroups {
//     contacts {
//       id
//       name
//       user {
//         id
//         name
//       }
//       linkedUser {
//         id
//         name
//         phone
//       }
//     }
//     groups {
//       id
//       name
//       memberIds
//       owner {
//         id
//         name
//       }
//       members {
//         id
//         name
//       }
//     }
//   }
// `;

// const CREATE_CURATION = gql`
//   mutation($url: String!, $comment: String, $saveToMyLinks: Boolean, $selectedContactIds: [String!]) {
//     createCuration(
//       url: $url
//       comment: $comment
//       saveToMyLinks: $saveToMyLinks
//       selectedContactIds: $selectedContactIds
//     ) {
//       curations {
//         id
//       }
//     }
//   }
// `;

type Props = {
  forwardUrl?: string;
  isOpen?: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSubmitComplete: () => void;
};

type Contact = { phoneNumber: number; name: string };

const NewLink = (props: Props) => {
  const { forwardUrl, isOpen, onClose, onOpen, onSubmitComplete } = props;

  const [saveToMyLinks, setSaveToMyLinks] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [showingNewLink, showNewLink, hideNewLink] = useBoolean(false);

  const { contacts, groups, loading: loadingContacts } = useContacts();

  const { saveCuration } = useApi();

  useEffect(() => {
    if (isOpen) {
      showNewLink();
    }
  }, [isOpen]);

  const handleSave = async (values: any) => {
    const { url, comment } = values;

    await saveCuration({ url, comment, saveToMyLinks, selectedContacts });

    // await createCuration({
    //   variables: {
    //     url,
    //     comment: comment || '',
    //     saveToMyLinks,
    //     selectedContactIds
    //   }
    // });

    setSaveToMyLinks(false);
    setSelectedContacts([]);

    hideNewLink();
    onClose();
    onSubmitComplete();
    useToast('Curation successfully created');
  };

  const { handleChange, handleSubmit, values } = useForm(handleSave, validate);

  const { url, comment } = values as any;

  useEffect(() => {
    if (forwardUrl) {
      handleChange('url', forwardUrl);
    }
  }, [forwardUrl]);

  const handleOpen = () => {
    showNewLink();
    onOpen();
  };

  const handleCancel = () => {
    hideNewLink();
    onClose();
  };

  const handleCheckboxChange = () => {
    setSaveToMyLinks(!saveToMyLinks);
  };

  const handleUrlChange = (text: string) => {
    handleChange('url', text);
  };

  const handleCommentChange = (text: string) => {
    handleChange('comment', text);
  };

  const handleContactPress = (contact: Contact) => {
    const alreadySelected = selectedContacts.some(({ phoneNumber }) => phoneNumber === contact.phoneNumber);

    if (alreadySelected) {
      setSelectedContacts((prevState) => prevState.filter(({ phoneNumber }) => phoneNumber !== contact.phoneNumber));
    } else {
      setSelectedContacts((prevState) => [...prevState, contact]);
    }
  };

  if (loadingContacts) return <Spinner />;

  // if (!data) return null;

  const buttonText = 'New Curation';
  const saveDisabled = !saveToMyLinks && !selectedContacts.length;

  return (
    <Overlay
      {...{ buttonText, saveDisabled }}
      onSave={handleSubmit}
      onCancel={handleCancel}
      fullscreen
      onPress={handleOpen}
      // loading={processing}
      isOpen={showingNewLink}>
      <View>
        <Input placeholder="Link URL" autoCapitalize="none" onChangeText={handleUrlChange} value={url} color="white" />
        <Spacer />
        <Input onChangeText={handleCommentChange} value={comment || ''} color="white" placeholder="Comment" />
        {!forwardUrl ? (
          <CheckBox
            title="Save to my links"
            center
            checked={saveToMyLinks}
            checkedColor={colors.darkerGreen}
            textStyle={styles.checkbox}
            onPress={handleCheckboxChange}
            containerStyle={{
              backgroundColor: 'rgba(0,0,0,0)',
              borderColor: 'rgba(0,0,0,0)',
            }}
          />
        ) : (
          <Spacer size={2} />
        )}
      </View>
      <ContactsPickList
        onPress={handleContactPress}
        selectedContacts={selectedContacts}
        loading={loadingContacts}
        {...{ contacts, groups }}
      />
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  checkbox: {
    color: colors.textGrey,
    fontFamily: 'KohinoorBangla-Semibold',
    fontSize: 16,
  },
});

export default NewLink;
