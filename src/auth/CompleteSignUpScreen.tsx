import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { Container, Input, Header, Spacer, Button, Spinner } from '../common';

type Props = {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  onUpdate: () => void;
};

const CompleteSignUpScreen = ({ onUpdate, currentUser, setCurrentUser }: Props) => {
  console.log('🚀 ~ file: CompleteSignUpScreen.tsx ~ line 15 ~ CompleteSignUpScreen ~ currentUser', currentUser);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async () => {
    try {
      await firestore()
        .collection('users')
        .doc(currentUser.id)
        .set({ firstName, lastName, phoneNumber: currentUser.phoneNumber });

      setCurrentUser({ ...currentUser, firstName, lastName });
      onUpdate();
    } catch (error) {
      console.log('🚀 ~ file: CompleteSignUpScreen.tsx ~ line 23 ~ handleSubmit ~ error', error);
      Alert.alert('Error', 'There was an error saving your details. Please try again.');
    }
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

        <Button disabled={!firstName || !lastName} bordered onPress={handleSubmit}>
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
    flex: 1,
  },
  inputWrapper: {
    flex: 1,
  },
};
