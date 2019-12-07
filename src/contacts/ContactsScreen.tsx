import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import {
  NavigationBottomTabScreenComponent,
  NavigationTabScreenProps
} from 'react-navigation-tabs';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Container, AppText, Spinner } from '../common';
import ContactRow from './ContactRow';
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

const ContactsScreen: NavigationBottomTabScreenComponent<NavigationTabScreenProps> = ({
  navigation
}) => {
  const [editMode, setEditMode] = useState(false);
  const toggleEditMode = () => setEditMode(prevState => !prevState);
  const buttonText: string = editMode ? 'Done' : 'Edit';

  useEffect(() => {
    navigation.setParams({ buttonText, toggleEditMode });
  }, [editMode]);

  const { data, loading, refetch } = useQuery(FETCH_CONTACTS);

  const [deleteContact, { error, loading: deleteLoading }] = useMutation(
    DELETE_CONTACT
  );

  const handleDelete = async (id: string) => {
    await deleteContact({ variables: { id } });
    await refetch();
    toggleEditMode();
  };

  // setEditMode = async () => {
  //   await this.props.setEditMode(this.props.editMode)
  //   this.props.navigation.setParams({
  //     editMode: this.props.editMode,
  //   })
  // }

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

  if (loading) {
    return <Spinner size="large" text="Loading contacts..." />;
  }

  const renderContent = () => {
    if (!loading && !data) {
      return <AppText>No Contacts Yet</AppText>;
    } else {
      return (
        <FlatList
          data={data.contacts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          removeClippedSubviews={false}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <Container style={styles.pageContainer}>{renderContent()}</Container>
      <NewContact navigate={navigation.navigate} />
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  pageContainer: {
    backgroundColor: 'white'
  }
});
