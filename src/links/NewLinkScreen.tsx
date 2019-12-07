import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useMutation, useQuery } from 'react-apollo';
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
  mutation($url: String!, $comment: String, $saveToMyLinks: Boolean) {
    createCuration(
      url: $url
      comment: $comment
      saveToMyLinks: $saveToMyLinks
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

const NewLinkScreen = () => {
  const [saveToMyLinks, setSaveToMyLinks] = useState(false);

  const { data: contactsData, loading: loadingContacts } = useQuery(
    FETCH_CONTACTS
  );

  const [createCuration, { loading: processing, error }] = useMutation(
    CREATE_CURATION
  );

  const saveCuration = (values: any) => {
    const { url, comment } = values;
    createCuration({ variables: { url, comment, saveToMyLinks } });
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

  return (
    <Container style={styles.container}>
      <PageWrapper>
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
          value={comment}
          color="grey"
        />
        <CheckBox
          title="Save to my links"
          center
          checked={saveToMyLinks}
          checkedColor={colors.darkerGreen}
          textStyle={{
            color: colors.textGrey,
            fontFamily: 'KohinoorBangla-Semibold',
            fontSize: 18
          }}
          onPress={handleCheckboxChange}
          containerStyle={{
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)'
          }}
        />
        <Button onPress={handleSubmit} loading={processing}>
          Save
        </Button>
        {/* <Button onPress={handleCancel} loading={loading}>
          Cancel
        </Button> */}
      </PageWrapper>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  }
});

export default NewLinkScreen;
