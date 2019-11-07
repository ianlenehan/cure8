import React, { useState, useContext, FunctionComponent } from 'react';
import { View } from 'react-native';
import firebase from 'react-native-firebase';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import AppContext from '../utils/AppContext';
import { Container, Input, Header, Spacer, Button } from '../common';

const USER_QUERY = gql`
  query user($phone: String!) {
    user(phone: $phone) {
      name
      id
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser(
    $firstName: String!
    $lastName: String!
    $phone: String!
  ) {
    createUser(firstName: $firstName, lastName: $lastName, phone: $phone) {
      user {
        id
        name
      }
    }
  }
`;

const CompleteSignUpScreen: FunctionComponent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const { authUser } = useContext(AppContext);
  // const handleLogout = () => {
  //   firebase.auth().signOut();
  // };
  const { data, loading, error } = useQuery(USER_QUERY, {
    variables: { phone: authUser.phoneNumber }
  });
  const [createUser] = useMutation(CREATE_USER_MUTATION);

  console.log({ data, loading, error });

  const handleSubmit = async () => {
    if (!data) {
      const firebaseAuthUser = firebase.auth().currentUser;
      if (firebaseAuthUser) {
        await firebaseAuthUser.updateProfile({
          displayName: `${firstName} ${lastName}`
        });
        const res = await createUser({
          variables: { firstName, lastName, phone: authUser.phoneNumber }
        });

        console.log({ res });
      }
    }
  };

  return (
    <Container style={{ marginTop: 30 }}>
      <Header headerNumber={3}>What shall we call you?</Header>
      <View style={styles.innerContainer}>
        <Spacer size={2} />
        <Input
          onChangeText={setFirstName}
          label="First Name"
          placeholder="Holly"
          value={firstName}
        />
        <Spacer size={2} />
        <Input
          onChangeText={setLastName}
          label="Last Name"
          placeholder="Golightly"
          value={lastName}
        />
        <Spacer size={4} />

        <Button disabled={!firstName || !lastName} onPress={handleSubmit}>
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
