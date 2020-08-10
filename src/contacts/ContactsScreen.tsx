import React, { FC, useState, useEffect } from 'react';
import { Tab, Tabs, TabHeading } from 'native-base';
import { Icon, Button as BaseButton } from 'react-native-elements';
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

type Props = {
  navigation: any;
};

const ContactsScreen: FC<Props> = ({ navigation }) => {
  const [editMode, setEditMode] = useState(false);
  const buttonText: string = editMode ? 'Done' : 'Edit';

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <BaseButton
          title={buttonText || ''}
          type="clear"
          onPress={toggleEditMode}
          titleStyle={{ fontSize: 16, color: 'white' }}
          containerStyle={{ marginRight: 10 }}
        />
      )
    });
  }, [navigation, editMode]);

  const { data, loading, error, refetch } = useQuery(FETCH_CONTACTS);

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
