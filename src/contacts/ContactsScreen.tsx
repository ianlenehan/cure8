import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Tab, Tabs, TabHeading } from 'native-base';
import { Icon } from 'react-native-elements';
import {
  NavigationBottomTabScreenComponent,
  NavigationTabScreenProps
} from 'react-navigation-tabs';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import { Container, AppText, colors, Spinner } from '../common';
import ContactsTab from './ContactsTab';
import GroupsTab from './GroupsTab';

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

const ContactsScreen: NavigationBottomTabScreenComponent<
  NavigationTabScreenProps
> = ({ navigation }) => {
  const [editMode, setEditMode] = useState(false);
  const buttonText: string = editMode ? 'Done' : 'Edit';

  useEffect(() => {
    navigation.setParams({ buttonText, toggleEditMode });
  }, [editMode]);

  const { data, loading, refetch } = useQuery(FETCH_CONTACTS);

  if (loading) return <Spinner text="Loading contacts..." />;

  const toggleEditMode = () => setEditMode(prevState => !prevState);
  const contacts = data.contacts || [];
  return (
    <Container>
      <Tabs>
        <Tab
          heading={
            <TabHeading>
              <Icon
                name="address-book"
                type="font-awesome"
                size={18}
                containerStyle={{ marginRight: 5 }}
                color={colors.textGrey}
              />
              <AppText size="medium">Contacts</AppText>
            </TabHeading>
          }>
          <ContactsTab
            navigate={navigation.navigate}
            onDeleteCompletion={toggleEditMode}
            {...{ editMode, refetch, loading, contacts }}
          />
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Icon
                name="users"
                type="font-awesome"
                size={18}
                containerStyle={{ marginRight: 5 }}
                color={colors.textGrey}
              />
              <AppText size="medium">Groups</AppText>
            </TabHeading>
          }>
          <GroupsTab
            navigate={navigation.navigate}
            onDeleteCompletion={toggleEditMode}
            {...{ editMode, contacts }}
          />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ContactsScreen;
