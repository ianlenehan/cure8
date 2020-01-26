import React, { useState, FunctionComponent } from 'react';
import { StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import useForm from '../hooks/useForm';
import useToast from '../hooks/useToast';
import { Input, Spacer, Overlay, Spinner, colors } from '../common';
import validate from './validate';
import ContactsPickList from '../contacts/ContactsPickList';

const FETCH_CONTACTS_AND_GROUPS = gql`
  query contactsAndGroups {
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
    groups {
      id
      name
      memberIds
      owner {
        id
        name
      }
      members {
        id
        name
      }
    }
  }
`;

const CREATE_CURATION = gql`
  mutation(
    $url: String!
    $comment: String
    $saveToMyLinks: Boolean
    $selectedContactIds: [String!]
  ) {
    createCuration(
      url: $url
      comment: $comment
      saveToMyLinks: $saveToMyLinks
      selectedContactIds: $selectedContactIds
    ) {
      curations {
        id
      }
    }
  }
`;

type Props = {
  onOverlayCancel: () => void;
  overlayIsOpen: boolean;
  refetchLinks: () => void;
};

const NewLink: FunctionComponent<Props> = ({
  onOverlayCancel,
  overlayIsOpen,
  refetchLinks
}) => {
  const [saveToMyLinks, setSaveToMyLinks] = useState<boolean>(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const { data, loading: loadingContacts } = useQuery(
    FETCH_CONTACTS_AND_GROUPS
  );

  const [createCuration, { loading: processing, error }] = useMutation(
    CREATE_CURATION
  );

  const saveCuration = async (values: any) => {
    const { url, comment } = values;

    await createCuration({
      variables: {
        url,
        comment: comment || '',
        saveToMyLinks,
        selectedContactIds
      }
    });

    setSaveToMyLinks(false);
    setSelectedContactIds([]);

    onOverlayCancel();
    refetchLinks();
    useToast('Curation successfully created');
  };

  const { handleChange, handleSubmit, values } = useForm(
    saveCuration,
    validate
  );

  const { url, comment } = values as any;

  const handleCheckboxChange = () => {
    setSaveToMyLinks(!saveToMyLinks);
  };

  const handleUrlChange = (text: string) => {
    handleChange('url', text);
  };

  const handleCommentChange = (text: string) => {
    handleChange('comment', text);
  };

  const handleContactPress = (contactId: string) => {
    if (selectedContactIds.includes(contactId)) {
      const otherContacts = selectedContactIds.filter(c => c !== contactId);
      setSelectedContactIds(otherContacts);
    } else {
      setSelectedContactIds(prevState => [...prevState, contactId]);
    }
  };

  if (loadingContacts) return <Spinner />;

  if (!data) return null;

  const buttonText = 'New Link';
  const saveDisabled = false;

  return (
    <Overlay
      {...{ buttonText, saveDisabled }}
      fullscreen
      hideMainButton
      onSave={handleSubmit}
      onCancel={onOverlayCancel}
      loading={processing}
      isOpen={overlayIsOpen}>
      <Input
        placeholder="Link URL"
        autoCapitalize="none"
        onChangeText={handleUrlChange}
        value={url}
        color="white"
      />
      <Spacer />
      <Input
        onChangeText={handleCommentChange}
        value={comment || ''}
        color="white"
        placeholder="Comment"
      />
      <CheckBox
        title="Save to my links"
        center
        checked={saveToMyLinks}
        checkedColor={colors.darkerGreen}
        textStyle={styles.checkbox}
        onPress={handleCheckboxChange}
        containerStyle={{
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: 'rgba(0,0,0,0)'
        }}
      />
      <ContactsPickList
        onPress={handleContactPress}
        selectedContactIds={selectedContactIds}
        contacts={data.contacts}
        groups={data.groups}
        loading={loadingContacts}
        editMode={false}
      />
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  checkbox: {
    color: colors.textGrey,
    fontFamily: 'KohinoorBangla-Semibold',
    fontSize: 16
  }
});

export default NewLink;