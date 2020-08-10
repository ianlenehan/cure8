import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useMutation, useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import useForm from '../hooks/useForm';
import useToast from '../hooks/useToast';
import useBoolean from '../hooks/useBoolean';
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
  forwardUrl?: string;
  isOpen?: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSubmitComplete: () => void;
};

const NewLink = (props: Props) => {
  const { forwardUrl, isOpen, onClose, onOpen, onSubmitComplete } = props;

  const [saveToMyLinks, setSaveToMyLinks] = useState<boolean>(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [showingNewLink, showNewLink, hideNewLink] = useBoolean(false);

  const { data, loading: loadingContacts } = useQuery(
    FETCH_CONTACTS_AND_GROUPS
  );

  const [createCuration, { loading: processing }] = useMutation(
    CREATE_CURATION
  );

  useEffect(() => {
    if (isOpen) {
      showNewLink();
    }
  }, [isOpen]);

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

    hideNewLink();
    onClose();
    onSubmitComplete();
    useToast('Curation successfully created');
  };

  const { handleChange, handleSubmit, values } = useForm(
    saveCuration,
    validate
  );

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

  const handleContactPress = (contactIds: string[]) => {
    let newIds = [...selectedContactIds];
    contactIds.forEach(contactId => {
      if (selectedContactIds.includes(contactId)) {
        newIds = newIds.filter(c => c !== contactId);
      } else {
        newIds.push(contactId);
      }
    });
    setSelectedContactIds(newIds);
  };

  if (loadingContacts) return <Spinner />;

  if (!data) return null;

  const buttonText = 'New Curation';
  const saveDisabled = !saveToMyLinks && !selectedContactIds.length;

  return (
    <Overlay
      {...{ buttonText, saveDisabled }}
      onSave={handleSubmit}
      onCancel={handleCancel}
      fullscreen
      onPress={handleOpen}
      loading={processing}
      isOpen={showingNewLink}>
      <View>
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
              borderColor: 'rgba(0,0,0,0)'
            }}
          />
        ) : (
          <Spacer size={2} />
        )}
      </View>
      <ContactsPickList
        onPress={handleContactPress}
        selectedContactIds={selectedContactIds}
        contacts={data.contacts}
        groups={data.groups}
        loading={loadingContacts}
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
