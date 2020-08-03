import React, { useState } from 'react';
import { View } from 'react-native';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

import { Container, Input, Header, Spacer, Button, Spinner } from '../common';

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser(
    $firstName: String!
    $lastName: String!
    $phone: String!
  ) {
    updateUser(firstName: $firstName, lastName: $lastName, phone: $phone) {
      user {
        id
        name
        phone
      }
    }
  }
`;

type Props = {
  onUpdate: () => void;
  phone: string | undefined;
};

const CompleteSignUpScreen = ({ onUpdate, phone }: Props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [updateUser, { loading }] = useMutation(UPDATE_USER_MUTATION);

  if (loading) return <Spinner />;

  const handleSubmit = async () => {
    await updateUser({
      variables: { firstName, lastName, phone }
    });
    onUpdate();
  };

  return (
    <Container>
      <Spacer size={2} />
      <Header headerNumber={3} color="white">
        What shall we call you?
      </Header>
      <View style={styles.innerContainer}>
        <Spacer size={2} />
        <Input
          onChangeText={setFirstName}
          label="First Name"
          placeholder="Holly"
          value={firstName}
          labelColor="white"
        />
        <Spacer size={2} />
        <Input
          onChangeText={setLastName}
          label="Last Name"
          placeholder="Golightly"
          value={lastName}
          labelColor="white"
        />
        <Spacer size={4} />

        <Button
          disabled={!firstName || !lastName}
          bordered
          onPress={handleSubmit}>
          Continue
        </Button>
      </View>
    </Container>
  );
};

export default CompleteSignUpScreen;

const styles = {
  innerContainer: {
    marginLeft: '7.5%',
    marginRight: '7.5%',
    flex: 1
  },
  inputWrapper: {
    flex: 1
  }
};
