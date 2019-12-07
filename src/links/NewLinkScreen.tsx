import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useMutation, useQuery } from 'react-apollo';
import { Toast } from 'native-base';
import gql from 'graphql-tag';
import useForm from '../hooks/useForm';
import {
  Container,
  PageWrapper,
  AppText,
  Button,
  Input,
  Spacer,
  Header,
  colors
} from '../common';
import validate from './validate';
import ContactsPickList from './ContactsPickList';

const FETCH_CONTACTS = gql`
  query contacts {
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
        link {
          id
          image
          title
          url
        }
      }
    }
  }
`;

const NewLinkScreen = ({ navigation }) => {
  const [saveToMyLinks, setSaveToMyLinks] = useState<boolean>(false);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);

  const { data: contactsData, loading: loadingContacts } = useQuery(
    FETCH_CONTACTS
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
    navigation.pop();

    Toast.show({
      text: 'Curation successfully created',
      position: 'top',
      buttonText: 'OK',
      duration: 3000
    });
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

  return (
    <Container style={styles.container}>
      <Spacer size={2} />
      <Input
        label="Link URL"
        placeholder="www.cure8.io"
        autoCapitalize="none"
        onChangeText={handleUrlChange}
        value={url}
        color="grey"
      />
      <Spacer size={2} />
      <Input
        label="Comment"
        onChangeText={handleCommentChange}
        value={comment || ''}
        color="grey"
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
        contacts={contactsData && contactsData.contacts}
        loading={loadingContacts}
        groups={[]}
        editMode={false}
      />
      <Button onPress={handleSubmit} loading={processing}>
        Save
      </Button>
      {/* <Button onPress={handleCancel} loading={loading}>
          Cancel
        </Button> */}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  checkbox: {
    color: colors.textGrey,
    fontFamily: 'KohinoorBangla-Semibold',
    fontSize: 18
  }
});

export default NewLinkScreen;
