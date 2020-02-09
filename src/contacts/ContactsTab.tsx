import React, { useState, useEffect, FunctionComponent } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Container, Spinner, ContactRow, EmptyPage } from '../common';
import NewContact from './NewContact';

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

const ContactsTab: FunctionComponent<Props> = props => {
  const {
    navigate,
    editMode,
    onDeleteCompletion,
    contacts,
    loading,
    refetch
  } = props;

  const [deleteContact, { error, loading: deleteLoading }] = useMutation(
    DELETE_CONTACT
  );

  const handleDelete = async (id: string) => {
    await deleteContact({ variables: { id } });
    await refetch();
    onDeleteCompletion();
  };

  const renderItem = ({ item }: { item: ContactType }) => {
    const onDeletePress = () => handleDelete(item.id);

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
