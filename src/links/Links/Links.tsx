import React, { Fragment, FunctionComponent, useState, useEffect } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Modal,
  LayoutAnimation,
  TouchableWithoutFeedback
} from 'react-native';

import IonIcon from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import { get } from 'lodash';

import {
  AppText,
  Button,
  Spacer,
  Tag,
  TagContainer,
  colors,
  EmptyPage
} from '../../common';
import useToast from '../../hooks/useToast';
import useBoolean from '../../hooks/useBoolean';
import Card from '../Card';
import NewLink from '../NewLink';
import ArchiveModal from '../ArchiveModal';
import WebViewer from '../WebViewer';

import { ArchiveVariablesType, CurationType, TagType } from '../types';

type Props = {
  curations: [CurationType];
  currentUserId: string;
  filteredTagIds?: string[];
  isArchivedLinks?: boolean;
  onArchive: (variables: ArchiveVariablesType) => void;
  onClearTagFilter?: () => void;
  onDelete: (id: string) => void;
  onTagPress?: (tag: TagType) => void;
  onNewLinkSubmit: () => void;
  setParams?: any;
  tags: TagType[];
};

const Links: FunctionComponent<Props> = props => {
  const {
    curations = [],
    currentUserId,
    filteredTagIds = [],
    isArchivedLinks,
    onArchive,
    onClearTagFilter = () => {},
    onDelete,
    onTagPress = () => {},
    onNewLinkSubmit,
    setParams,
    tags
  } = props;

  const [openRows, setOpenRows] = useState<string[]>([]);
  const [archiveModalVisible, setArchiveModalVisible] = useState<boolean>(
    false
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const [selectedCurationId, setSelectedCurationId] = useState<string>('');
  const [selectedCuration, setSelectedCuration] = useState<
    CurationType | undefined
  >();
  const [forwardUrl, setForwardUrl] = useState<string>('');
  const [selectedRating, setRating] = useState<string>('');
  const [tagSelectorOpen, setTagSelectorOpen] = useState(false);
  const [showingNewLink, showNewLink, hideNewLink] = useBoolean(false);

  useEffect(() => {
    if (setParams) {
      setParams({ onNewLinkPress: handleNewLinkPress });
    }
  }, []);

  const handleNewLinkPress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    showNewLink();
  };

  const handleRatingPress = (rating: string) => {
    if (rating === selectedRating) {
      setRating('');
    } else {
      setRating(rating);
    }
  };

  const handleScrollEnabled = (rowKey: string) => {
    setOpenRows(prevState => [...prevState, rowKey]);
  };

  const handleRowDidClose = (rowKey: string) => {
    const newOpenRows = openRows.filter(row => row !== rowKey);
    setOpenRows(newOpenRows);
  };

  const handleArchiveConfirm = async () => {
    await onArchive({
      id: selectedCurationId,
      tags: tagNames,
      rating: selectedRating
    });
    setArchiveModalVisible(false);
    setTag('');
    setOpenRows([]);
  };

  const handleArchivePress = (curationId: string) => {
    setSelectedCurationId(curationId);
    setArchiveModalVisible(true);
  };

  const handleDeletePress = async (curationId: string) => {
    setSelectedCurationId(curationId);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    await onDelete(selectedCurationId);
    setDeleteModalVisible(false);
    useToast('Curation successfully deleted');
    setOpenRows([]);
  };

  const handleSaveNewTag = () => {
    setTagNames(prevState => [...prevState, tag]);
    setTag('');
  };

  const handleTagPress = (tag: TagType) => {
    if (tagNames.includes(tag.name)) {
      const otherTags = tagNames.filter(t => t !== tag.name);
      setTagNames(otherTags);
    } else {
      setTagNames(prevState => [...prevState, tag.name]);
    }
  };

  const handleWebViewerClose = () => setSelectedCuration(undefined);

  const handleNewLinkSubmit = () => {
    onNewLinkSubmit();
    setOpenRows([]);
    setForwardUrl('');
  };

  const renderHiddenItem = ({ item }: { item: CurationType }) => {
    const handleForwardLinkPress = () => {
      setForwardUrl(item.link.url);
      handleNewLinkPress();
    };

    const renderChatButton = () => {
      if (!item.sharedWith.length || item.curatorId !== currentUserId)
        // TODO should be ===
        return null;
      // const sharedWithOnlyYou = item.sharedWith.length > 1 &&

      const handlePress = () => {
        const discussWithOwner = () => {};
        const discussWithEveryone = () => {};
        const message =
          item.sharedWith.length > 1
            ? `Discuss article with ${item.curatorName} or with everyone ${
                item.curatorName
              } shared it with.`
            : `Discuss article with ${item.curatorName}.`;

        const cancelOption = {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
          style: 'cancel'
        };

        const oneOptionButtons = [
          { text: 'Discuss', onPress: discussWithOwner },
          cancelOption
        ];
        const twoOptionButtons = [
          { text: item.curatorName, onPress: discussWithOwner },
          { text: 'Everyone', onPress: discussWithEveryone },
          cancelOption
        ];

        const buttons =
          item.sharedWith.length < 1 ? twoOptionButtons : oneOptionButtons;
        // @ts-ignore
        Alert.alert('Discuss', message, buttons);
      };

      return (
        <Icon
          color={colors.tertiaryBlue}
          name="comment"
          type="font-awesome"
          reverse
          size={18}
          onPress={handlePress}
        />
      );
    };

    return (
      <View style={styles.rowBack}>
        <View />
        <View style={styles.rightBack}>
          {renderChatButton()}
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
            onPress={handleForwardLinkPress}
          />
        </View>
      </View>
    );
  };

  const renderCuration = ({ item }: { item: CurationType }) => {
    const curatorName =
      item.curatorId === currentUserId ? 'you' : item.curatorName;
    const { id, link, comment, createdAt, rating, tags, sharedWith } = item;
    const handlePress = () => setSelectedCuration(item);
    return (
      <Card
        key={id}
        image={link.image}
        title={link.title}
        date={createdAt}
        curatedBy={curatorName}
        onPress={handlePress}
        sharedWith={sharedWith}
        {...{ comment, rating, tags, onTagPress, filteredTagIds, sharedWith }}
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

  const renderContent = () => {
    if (!curations.length) {
      const message = isArchivedLinks
        ? "You've not archived any links yet!"
        : 'You have no new curations!';
      return (
        <EmptyPage text={message}>
          <View>
            <Spacer size={2} />
            {!isArchivedLinks && (
              <IonIcon.Button
                name="plus-square"
                backgroundColor={colors.primaryGreen}
                onPress={handleNewLinkPress}>
                Create One
              </IonIcon.Button>
            )}
          </View>
        </EmptyPage>
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
          onTagChange={setTag}
          onTagPress={handleTagPress}
          onSaveNewTag={handleSaveNewTag}
          onHideModal={() => setArchiveModalVisible(false)}
          onRatingPress={handleRatingPress}
          onArchive={handleArchiveConfirm}
          existingTags={tags}
          {...{ tagNames, tag, selectedRating }}
        />

        <Modal animationType="fade" visible={deleteModalVisible} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalInner}>
              <AppText size="large" style={{ textAlign: 'center' }}>
                Are you sure you want to delete this curation?
              </AppText>
              <View>
                <Button
                  size="small"
                  type="warning"
                  onPress={handleDeleteConfirm}>
                  Yes
                </Button>
                <Button
                  size="small"
                  onPress={() => setDeleteModalVisible(false)}>
                  No
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <Fragment>
      {renderContent()}
      <NewLink
        onOverlayCancel={hideNewLink}
        overlayIsOpen={showingNewLink}
        onSubmitComplete={handleNewLinkSubmit}
        {...{ forwardUrl }}
      />
      <WebViewer
        onRequestClose={handleWebViewerClose}
        curationUrl={get(selectedCuration, 'link.url')}
      />
    </Fragment>
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    padding: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  tagSelectorTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
