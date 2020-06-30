import React, { Fragment, useState } from 'react';
import { Alert, View, StyleSheet, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';

import IonIcon from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import { get } from 'lodash';

import { AppText, Spacer, Tag, TagContainer, colors, EmptyPage } from '../../common';
import useBoolean from '../../hooks/useBoolean';
import Card from '../Card';
import NewLink from '../NewLink';
import ArchiveModal from '../ArchiveModal';
import WebViewer from '../WebViewer';
import DeleteModal from './DeleteModal';

import { ArchiveVariablesType, CurationType, TagType } from '../types';

type Props = {
  curations: [CurationType];
  currentUserId: string;
  filteredTagIds?: string[];
  isArchivedLinks?: boolean;
  onArchive: (variables: ArchiveVariablesType) => void;
  onClearTagFilter?: () => void;
  onCreateConversation: (id: string, userIds: string[]) => void;
  onDelete: (id: string) => void;
  onLoadMore: () => void;
  onTagPress?: (tag: TagType) => void;
  onNewLinkSubmit: () => void;
  hello?: any;
  tags: TagType[];
};

const Links = (props: Props) => {
  const {
    curations = [],
    currentUserId,
    filteredTagIds = [],
    isArchivedLinks,
    onArchive,
    onClearTagFilter = () => {},
    onCreateConversation,
    onDelete,
    onLoadMore,
    onTagPress = () => {},
    onNewLinkSubmit,
    tags
  } = props;

  const [openRows, setOpenRows] = useState<string[]>([]);
  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tag, setTag] = useState<string>('');
  const [selectedCurationId, setSelectedCurationId] = useState<string>('');
  const [selectedCuration, setSelectedCuration] = useState<CurationType | undefined>();
  const [forwardUrl, setForwardUrl] = useState<string>('');
  const [selectedRating, setRating] = useState<string>('');
  const [isTagSelectorOpen, openTagSelector, closeTagSelector] = useBoolean(false);
  const [showingNewLink, showNewLink, hideNewLink] = useBoolean(false);
  const [isArchiveModalVisible, openArchiveModal, closeArchiveModal] = useBoolean(false);
  const [isDeleteModalVisible, openDeleteModal, closeDeleteModal] = useBoolean(false);

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
    onArchive({
      id: selectedCurationId,
      tags: tagNames,
      rating: selectedRating
    });
    closeArchiveModal();
    setTag('');
    setOpenRows([]);
  };

  const handleArchivePress = (curationId: string) => {
    setSelectedCurationId(curationId);
    openArchiveModal();
  };

  const handleDeletePress = async (curationId: string) => {
    setSelectedCurationId(curationId);
    openDeleteModal();
  };

  const handleDeleteConfirm = async () => {
    onDelete(selectedCurationId);
    closeDeleteModal();
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
    hideNewLink();
  };

  const renderHiddenItem = ({ item }: { item: CurationType }) => {
    const handleForwardLinkPress = () => {
      setForwardUrl(item.link.url);
      showNewLink();
    };

    const renderChatButton = () => {
      if (item.curatorId === currentUserId) {
        return null;
      }

      const handlePress = () => {
        const discussWithOwner = () => {
          onCreateConversation(item.link.id, [item.curatorId]);
        };

        const discussWithEveryone = () => {
          const ids = item.sharedWith.map(({ id }: { id: string }) => id);
          onCreateConversation(item.link.id, [...ids, item.curatorId]);
        };

        const message =
          item.sharedWith.length > 1
            ? `Discuss article with ${item.curatorName} or with everyone ${item.curatorName} shared it with.`
            : `Discuss article with ${item.curatorName}.`;

        const cancelOption = { text: 'Cancel', style: 'cancel' };

        const oneOptionButtons = [{ text: 'Discuss', onPress: discussWithOwner }, cancelOption];
        const twoOptionButtons = [
          { text: item.curatorName, onPress: discussWithOwner },
          { text: 'Everyone', onPress: discussWithEveryone },
          cancelOption
        ];

        const buttons = item.sharedWith.length > 1 ? twoOptionButtons : oneOptionButtons;
        // @ts-ignore
        Alert.alert('Discuss', message, buttons);
      };

      return (
        <Icon color={colors.tertiaryBlue} name="comment" type="font-awesome" reverse size={18} onPress={handlePress} />
      );
    };

    return (
      <View style={styles.rowBack}>
        <View />
        <View style={styles.rightBack}>
          {renderChatButton()}
          <Icon
            color={colors.tertiaryBlue}
            name="share"
            type="font-awesome"
            reverse
            size={18}
            onPress={handleForwardLinkPress}
          />
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
        </View>
      </View>
    );
  };

  const renderCuration = ({ item }: { item: CurationType }) => {
    const curatorName = item.curatorId === currentUserId ? 'you' : item.curatorName;
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
        {...{
          comment,
          rating,
          tags,
          onTagPress,
          filteredTagIds,
          sharedWith
        }}
      />
    );
  };

  const renderTagSelector = () => {
    if (!isArchivedLinks || showingNewLink) return null;

    const icon = isTagSelectorOpen ? 'expand-less' : 'expand-more';

    const toggleTagSelector = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      if (isTagSelectorOpen) {
        closeTagSelector();
      } else {
        openTagSelector();
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
        {isTagSelectorOpen && (
          <TagContainer>
            {tags.map((tag: Tag) => (
              <Tag tag={tag} key={tag.id} onPress={onTagPress} selected={filteredTagIds.includes(tag.id)} />
            ))}
            <Icon size={24} containerStyle={{ margin: 5 }} name="cancel" color="#ddd" onPress={onClearTagFilter} />
          </TagContainer>
        )}
      </View>
    );
  };

  const renderContent = () => {
    if (!curations.length) {
      const message = isArchivedLinks ? "You've not archived any links yet!" : 'You have no new curations!';

      return (
        <EmptyPage text={message}>
          <View>
            <Spacer size={2} />
            {!isArchivedLinks && (
              <IonIcon.Button name="plus-square" backgroundColor={colors.primaryGreen} onPress={showNewLink}>
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
          onEndReachedThreshold={0.4}
          onEndReached={onLoadMore}
        />

        <NewLink
          onSubmitComplete={handleNewLinkSubmit}
          isOpen={showingNewLink}
          onClose={hideNewLink}
          onOpen={showNewLink}
          {...{ forwardUrl }}
        />

        <ArchiveModal
          isVisible={isArchiveModalVisible}
          onTagChange={setTag}
          onTagPress={handleTagPress}
          onSaveNewTag={handleSaveNewTag}
          onHideModal={closeArchiveModal}
          onRatingPress={handleRatingPress}
          onArchive={handleArchiveConfirm}
          existingTags={tags}
          {...{ tagNames, tag, selectedRating }}
        />

        <DeleteModal
          isVisible={isDeleteModalVisible}
          onDeleteConfirm={handleDeleteConfirm}
          onDismiss={closeDeleteModal}
        />
      </View>
    );
  };

  return (
    <Fragment>
      {renderContent()}
      <WebViewer onRequestClose={handleWebViewerClose} curationUrl={get(selectedCuration, 'link.url')} />
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
