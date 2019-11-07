import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useMutation } from 'react-apollo';
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

const NewLinkModal = () => {
  const [saveToMyLinks, setSaveToMyLinks] = useState(false);
  const [createCuration, { data, loading, error }] = useMutation(
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
    <Container>
      <PageWrapper>
        <Spacer size={2} />
        <Header headerNumber={2}>Curate New Link</Header>
        <Spacer size={2} />
        <Input
          label="Link URL"
          placeholder="www.cure8.io"
          autoCapitalize="none"
          onChangeText={handleUrlChange}
          value={url}
        />
        <Spacer size={2} />
        <Input
          label="Comment"
          onChangeText={handleCommentChange}
          value={comment}
        />
        <CheckBox
          title="Save to my links"
          center
          checked={saveToMyLinks}
          checkedColor="rgba(255, 255, 255, 0.8)"
          uncheckedColor="rgba(255, 255, 255, 0.8)"
          textStyle={{ color: 'rgba(255, 255, 255, 0.8)' }}
          onPress={handleCheckboxChange}
          containerStyle={{
            backgroundColor: 'rgba(0,0,0,0)',
            borderColor: 'rgba(0,0,0,0)'
          }}
        />
        <Button onPress={handleSubmit} loading={loading}>
          Save
        </Button>
        {/* <Button onPress={handleCancel} loading={loading}>
          Cancel
        </Button> */}
      </PageWrapper>
    </Container>
  );
};

export default NewLinkModal;
