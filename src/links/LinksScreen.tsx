import React, { FunctionComponent, useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Modal } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import { Toast } from 'native-base';
import gql from 'graphql-tag';
import {
  NavigationBottomTabScreenComponent,
  NavigationTabScreenProps
} from 'react-navigation-tabs';
import IonIcon from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';

import {
  AppText,
  Button,
  Input,
  Spacer,
  colors,
  Spinner,
  Tag
} from '../common';
import useToast from '../hooks/useToast';
import Card from './Card';
import ArchiveModal from './ArchiveModal';

import { SwipeListView } from 'react-native-swipe-list-view';

const FETCH_LINKS = gql`
  query curations {
    curations {
      id
      createdAt
      curatorName
      comment
      link {
        id
        image
        title
        url
      }
    }
  }
`;

const DELETE_CURATION = gql`
  mutation DeleteCuration($id: String!) {
    deleteCuration(id: $id) {
      curations {
        id
      }
    }
  }
`;

const ARCHIVE_CURATION = gql`
  mutation ArchiveCuration($id: String!) {
    archiveCuration(id: $id) {
      curations {
        id
      }
    }
  }
`;

type Curation = {
  id: string;
  link: { title: string; image: string };
  comment?: string;
  createdAt: string;
  curatorName: string;
};

const LinksScreen: NavigationBottomTabScreenComponent<NavigationTabScreenProps> = ({
  navigation
}) => {
  const [openRows, setOpenRows] = useState<string[]>([]);
  const [archiveModalVisible, setArchiveModalVisible] = useState<boolean>(
    false
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const [selectedCurationId, setSelectedCurationId] = useState();

  const [existingTags, setExistingTags] = useState(['one', 'two', 'three']);
  const { data, loading, error, refetch } = useQuery(FETCH_LINKS);

  const handleNewLinkPress = () => {
    navigation.navigate('NewLink');
  };

  const handleScrollEnabled = (rowKey: string) => {
    setOpenRows(openRows => [...openRows, rowKey]);
  };

  const handleRowDidClose = (rowKey: string) => {
    const newOpenRows = openRows.filter(row => row !== rowKey);
    setOpenRows(newOpenRows);
  };

  const [deleteCuration] = useMutation(DELETE_CURATION);

  const handleDeletePress = async (curationId: string) => {
    setSelectedCurationId(curationId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    await deleteCuration({ variables: { id: selectedCurationId } });
    setDeleteModalVisible(false);
    useToast('Curation successfully deleted');
    setOpenRows([]);
    refetch();
  };

  const handleArchivePress = () => {
    setArchiveModalVisible(true);
  };

  const handleTagChange = (value: string) => {
    setTag(value);
    const filteredTags = existingTags.filter(t => t.includes(value));
    setExistingTags(filteredTags);
  };

  const handleSaveNewTag = () => {
    console.log('save tag', tag);
  };

  const handleTagPress = (tag: string) => {
    if (tags.includes(tag)) {
      const otherTags = tags.filter(t => t !== tag);
      setTags(otherTags);
    } else {
      setTags(prevTags => [...prevTags, tag]);
    }
  };

  const renderHiddenItem = ({ item }: { item: Curation }) => {
    return (
      <View style={styles.rowBack}>
        <View></View>
        <View style={styles.rightBack}>
          <Icon
            color={colors.tertiaryBlue}
            name="trash"
            type="font-awesome"
            onPress={() => handleDeletePress(item.id)}
          />
          <Icon
            color={colors.tertiaryBlue}
            name="archive"
            type="font-awesome"
            onPress={handleArchivePress}
          />
          <Icon
            color={colors.tertiaryBlue}
            name="share"
            type="font-awesome"
            onPress={handleNewLinkPress}
          />
        </View>
      </View>
    );
  };

  const renderCuration = ({ item }: { item: Curation }) => {
    return (
      <Card
        key={item.id}
        image={item.link.image}
        title={item.link.title}
        comment={item.comment}
        date={item.createdAt}
        curatedBy={item.curatorName}
      />
    );
  };

  if (loading) return <Spinner />;

  if (!data) {
    return (
      <View style={styles.container}>
        <AppText size="large">You have no new saved links!</AppText>
        <Spacer size={2} />
        <IonIcon.Button
          name="plus-square"
          backgroundColor={colors.primaryGreen}
          onPress={handleNewLinkPress}>
          Create One
        </IonIcon.Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SwipeListView
        data={data.curations}
        renderItem={renderCuration}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
        renderHiddenItem={renderHiddenItem}
        disableRightSwipe
        rightOpenValue={-80}
        onRowDidOpen={handleScrollEnabled}
        onRowDidClose={handleRowDidClose}
      />

      <ArchiveModal
        isVisible={archiveModalVisible}
        onTagChange={handleTagChange}
        onTagPress={handleTagPress}
        onSaveNewTag={handleSaveNewTag}
        onHideModal={() => setArchiveModalVisible(false)}
        {...{ tags, tag, existingTags }}
      />

      <Modal animationType="fade" visible={deleteModalVisible} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalInner}>
            <AppText size="large" style={{ textAlign: 'center' }}>
              Are you sure you want to delete this curation?
            </AppText>
            <View>
              <Button size="small" type="warning" onPress={handleDeleteConfirm}>
                Yes
              </Button>
              <Button size="small" onPress={() => setDeleteModalVisible(false)}>
                No
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LinksScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
    backgroundColor: '#ecf0f1'
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end'
  },
  plusIcon: {
    opacity: 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2
  },
  scrollContainer: {
    flex: 1
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 30
  },
  rightBack: {
    justifyContent: 'space-around',
    flex: 1,
    alignItems: 'flex-end'
  },
  modalInner: {
    backgroundColor: 'white',
    height: '25%',
    padding: 10,
    paddingBottom: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around'
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    justifyContent: 'flex-end'
  },
  tagContainer: {
    borderTopWidth: 1,
    borderColor: '#dcdcdc',
    marginTop: 5,
    paddingTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
