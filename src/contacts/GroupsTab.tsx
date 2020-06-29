import React, { useState, FC } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Container, Spinner, ContactRow, EmptyPage } from '../common';
import NewGroup from './NewGroup';

const FETCH_GROUPS = gql`
  query groups {
    groups {
      id
      name
      memberIds
      owner {
        id
        name
      }
      members {
        id
        name
      }
    }
  }
`;

const DELETE_GROUP = gql`
  mutation DeleteGroup($id: String!) {
    deleteGroup(id: $id) {
      groups {
        id
      }
    }
  }
`;

type Props = {
  navigate: any;
  editMode: boolean;
  onDeleteCompletion: () => void;
  contacts: any;
};

type GroupType = {
  id: string;
  name: string;
  memberIds: [string];
  members: [{ id: string; name: string }];
  owner: {
    id: string;
    name: string;
    phone: string;
  };
  contacts: any;
};

const GroupsTab: FC<Props> = props => {
  const { editMode, onDeleteCompletion, contacts } = props;

  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  const { data, loading, refetch } = useQuery(FETCH_GROUPS);
  const [deleteGroup] = useMutation(DELETE_GROUP);

  if (loading) {
    return <Spinner size="large" text="Loading groups..." />;
  }

  const groups = data.groups || [];

  const handleDelete = async (id: string) => {
    await deleteGroup({ variables: { id } });
    await refetch();
    onDeleteCompletion();
  };

  const handleGroupSaveCompletion = () => {
    refetch();
    setSelectedGroupId('');
  };

  const handleGroupOverlayClose = () => {
    setSelectedGroupId('');
  };

  const renderItem = ({ item }: { item: GroupType }) => {
    const onDeletePress = () => handleDelete(item.id);
    const handlePress = () => setSelectedGroupId(item.id);

    const memberList = item.members.map(m => m.name).join(', ');

    return (
      <ContactRow
        title={item.name}
        isMember={false}
        disabled={loading}
        onPress={handlePress}
        subtitle={memberList}
        {...{ editMode, onDeletePress }}
      />
    );
  };

  const renderContent = () => {
    if (!groups.length) {
      return <EmptyPage text="No Groups Yet" />;
    } else {
      return (
        <FlatList
          data={groups}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          removeClippedSubviews={false}
        />
      );
    }
  };

  const selectedGroup = groups.find(
    (group: any) => group.id === selectedGroupId
  );

  return (
    <View style={styles.container}>
      <Container style={styles.pageContainer}>{renderContent()}</Container>
      <NewGroup
        onGroupSaveCompletion={handleGroupSaveCompletion}
        onGroupOverlayClose={handleGroupOverlayClose}
        {...{ contacts, selectedGroup }}
      />
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

export default GroupsTab;
