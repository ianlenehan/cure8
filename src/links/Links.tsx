import React, { FunctionComponent, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  LayoutAnimation,
  TouchableWithoutFeedback
} from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import IonIcon from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';

import { AppText, Button, Spacer, Tag, TagContainer, colors } from '../common';
import useToast from '../hooks/useToast';
import useBoolean from '../hooks/useBoolean';
import Card from './Card';
import NewLink from './NewLink';
import ArchiveModal from './ArchiveModal';
import { ARCHIVE_CURATION, DELETE_CURATION, FETCH_TAGS } from './graphql';

type TagType = {
  id: string;
  name: string;
};

type Curation = {
  id: string;
  link: { title: string; image: string };
  comment?: string;
  createdAt: string;
  curatorName: string;
  rating: string;
  tags: [TagType];
};

type Props = {
  curations: [Curation];
  refetch: () => void;
  isArchivedLinks?: boolean;
  onTagPress?: (tag: TagType) => void;
  onClearTagFilter?: () => void;
  filteredTagIds?: string[];
  setParams?: any;
};

const Links: FunctionComponent<Props> = ({
  curations,
  refetch,
  isArchivedLinks,
  onTagPress = () => {},
  onClearTagFilter = () => {},
  filteredTagIds = [],
  setParams
}) => {
  const [openRows, setOpenRows] = useState<string[]>([]);
  const [archiveModalVisible, setArchiveModalVisible] = useState<boolean>(
    false
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');

  const [selectedCurationId, setSelectedCurationId] = useState();
  const [selectedRating, setRating] = useState('');
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);
  const [showingNewLink, showNewLink, hideNewLink] = useBoolean(false);

  const { data: tagsData, refetch: refetchTags } = useQuery(FETCH_TAGS);
  const tags = tagsData ? tagsData.tags : [];

  const handleNewLinkPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    showNewLink();
  };

  useEffect(() => {
    if (setParams) {
      setParams({ onNewLinkPress: handleNewLinkPress });
    }
  }, []);

  const handleRatingPress = (rating: string) => {
    if (rating === selectedRating) {
      setRating('');
    } else {
      setRating(rating);
    }
  };

  const handleScrollEnabled = (rowKey: string) => {
    setOpenRows(openRows => [...openRows, rowKey]);
  };

  const handleRowDidClose = (rowKey: string) => {
    const newOpenRows = openRows.filter(row => row !== rowKey);
    setOpenRows(newOpenRows);
  };

  const [archiveCuration] = useMutation(ARCHIVE_CURATION);

  const handleArchiveConfirm = async () => {
    await archiveCuration({
      variables: { id: selectedCurationId, tags, rating: selectedRating }
    });
    setArchiveModalVisible(false);
    refetch();
    setOpenRows([]);
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

  const handleArchivePress = (curationId: string) => {
    setSelectedCurationId(curationId);
    setArchiveModalVisible(true);
  };

  const handleTagChange = (value: string) => {
    setTag(value);
  };

  const handleSaveNewTag = () => {
    setTagNames(prevState => [...prevState, tag]);
  };

  const handleTagPress = (tag: TagType) => {
    if (tagNames.includes(tag.name)) {
      const otherTags = tagNames.filter(t => t !== tag.name);
      setTagNames(otherTags);
    } else {
      setTagNames(prevState => [...prevState, tag.name]);
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
            reverse
            size={18}
            onPress={() => handleDeletePress(item.id)}
          />
          {!isArchivedLinks && (
            <Icon
              color={colors.tertiaryBlue}
              name="archive"
              type="font-awesome"
              reverse
              size={18}
              onPress={() => handleArchivePress(item.id)}
            />
          )}
          <Icon
            color={colors.tertiaryBlue}
            name="share"
            type="font-awesome"
            reverse
            size={18}
            onPress={handleNewLinkPress}
          />
        </View>
      </View>
    );
  };

  const renderCuration = ({ item }: { item: Curation }) => {
    const { id, link, comment, createdAt, curatorName, rating, tags } = item;
    return (
      <Card
        key={id}
        image={link.image}
        title={link.title}
        date={createdAt}
        curatedBy={curatorName}
        {...{ comment, rating, tags, onTagPress, filteredTagIds }}
      />
    );
  };

  const renderTagSelector = () => {
    if (!isArchivedLinks) return null;

    const icon = tagSelectorOpen ? 'expand-less' : 'expand-more';

    const toggleTagSelector = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      if (tagSelectorOpen) {
        setTagSelectorOpen(false);
      } else {
        setTagSelectorOpen(true);
      }
    };

    return (
      <View style={styles.tagSelector}>
        <TouchableWithoutFeedback onPress={toggleTagSelector}>
          <View style={styles.tagSelectorTop}>
            <AppText size="medium">Filter by tag</AppText>
            <Icon name={icon} color={colors.primaryGreen} size={32} />
          </View>
        </TouchableWithoutFeedback>
        {tagSelectorOpen && (
          <TagContainer>
            {tags.map((tag: Tag) => (
              <Tag
                tag={tag}
                key={tag.id}
                onPress={onTagPress}
                selected={filteredTagIds.includes(tag.id)}
              />
            ))}
            <Icon
              size={24}
              containerStyle={{ margin: 5 }}
              name="cancel"
              color="#ddd"
              onPress={onClearTagFilter}
            />
          </TagContainer>
        )}
      </View>
    );
  };

  if (!curations) {
    return (
      <View style={[styles.container, styles.noLinks]}>
        <AppText size="large">You have no links here!</AppText>
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
      {renderTagSelector()}
      <SwipeListView
        data={curations}
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
        onRatingPress={handleRatingPress}
        onArchiveConfirm={handleArchiveConfirm}
        existingTags={(tagsData && tagsData.tags) || []}
        {...{ tagNames, tag, selectedRating }}
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
      <NewLink
        onOverlayCancel={hideNewLink}
        overlayIsOpen={showingNewLink}
        refetchLinks={refetch}
      />
    </View>
  );
};

export default Links;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    flex: 1
  },
  noLinks: {
    alignItems: 'center'
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 15
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
  },
  tagSelector: {
    backgroundColor: 'white',
    padding: 5
  },
  tagSelectorTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
