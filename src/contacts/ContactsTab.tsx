import React, { FC } from 'react';
import { Alert, FlatList, View, StyleSheet } from 'react-native';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import useToast from '../hooks/useToast';
import { Container, Spinner, ContactRow, EmptyPage } from '../common';
import NewContact from './NewContact';

const DELETE_CONTACT = gql`
  mutation DeleteContact($id: String!) {
    deleteContact(id: $id) {
      contacts {
        id
      }
    }
  }
`;

type ContactType = {
  id: string;
  name: string;
  linkedUser: {
    id: string;
    name: string;
    phone: string;
  };
};

type Props = {
  navigate: any;
  editMode: boolean;
  onDeleteCompletion: () => void;
  contacts: any;
  loading: boolean;
  refetch: () => void;
};

const ContactsTab: FC<Props> = props => {
  const { navigate, editMode, onDeleteCompletion, contacts, loading, refetch } = props;

  const [deleteContact, { loading: deleteLoading }] = useMutation(DELETE_CONTACT);

  const handleDeleteConfirm = async (id: string, name: string) => {
    onDeleteCompletion();
    await deleteContact({ variables: { id } });
    await refetch();
    useToast(`Contact record for ${name} successfully deleted`);
  };

  const handleDelete = async (id: string, name: string) => {
    Alert.alert('Delete Contact', `Are you sure you want to delete ${name}?`, [
      { text: 'Yes', onPress: () => handleDeleteConfirm(id, name) },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const renderItem = ({ item }: { item: ContactType }) => {
    const onDeletePress = () => handleDelete(item.id, item.name);

    return (
      <ContactRow
        title={item.name}
        isMember={false}
        rightTitle={item.linkedUser.phone}
        disabled={loading || deleteLoading}
        {...{ editMode, onDeletePress }}
      />
    );
  };

  const renderContent = () => {
    if (!loading && !contacts.length) {
      return <EmptyPage text="No Contacts Yet" />;
    } else {
      return (
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          removeClippedSubviews={false}
        />
      );
    }
  };

  if (loading) {
    return <Spinner size="large" text="Loading contacts..." />;
  }

  return (
    <View style={styles.container}>
      <Container style={styles.pageContainer}>{renderContent()}</Container>
      <NewContact navigate={navigate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  pageContainer: {
    backgroundColor: 'white'
  }
});

export default ContactsTab;
