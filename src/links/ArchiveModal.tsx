import React, { FunctionComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import faker from 'faker';

import { Button, Input, Tag, TagContainer, colors } from '../common';

const RATINGS = ['👍', '😂', '😢', '😲', '😡'];

type TagType = {
  id: string;
  name: string;
};

type Props = {
  existingTags: [TagType];
  isVisible: boolean;
  onArchiveConfirm: () => void;
  onHideModal: () => void;
  onRatingPress: (rating: string) => void;
  onSaveNewTag: () => void;
  onTagChange: (value: string) => void;
  onTagPress: (tag: TagType) => void;
  selectedRating?: string;
  tag?: string;
  tagNames: string[];
};

const ArchiveModal: FunctionComponent<Props> = props => {
  const {
    existingTags,
    isVisible,
    onArchiveConfirm,
    onHideModal,
    onRatingPress,
    onSaveNewTag,
    onTagChange,
    onTagPress,
    selectedRating,
    tag,
    tagNames = []
  } = props;

  const newTags = tagNames.filter(
    tagName => !existingTags.find(tag => tag.name === tagName)
  );

  return (
    <Modal animationType="fade" visible={isVisible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalInner}>
          <View style={{ flex: 1 }}>
            <Input
              autoCapitalize="none"
              color="grey"
              label="Add tags"
              onChangeText={onTagChange}
              value={tag}
              small
            />
            {!!tag && (
              <Button onPress={onSaveNewTag} type="tertiary" size="small">
                Add New Tag: {tag}
              </Button>
            )}

            <TagContainer>
              {newTags.map((tagName: string) => {
                const tag = { id: faker.random.uuid(), name: tagName };
                return (
                  <Tag key={tag.id} onPress={onTagPress} selected tag={tag} />
                );
              })}
              {existingTags.map((tag: Tag) => (
                <Tag
                  key={tag.id}
                  onPress={onTagPress}
                  selected={tagNames.includes(tag.name)}
                  tag={tag}
                />
              ))}
            </TagContainer>
          </View>
          <View style={styles.ratings}>
            {RATINGS.map(rating => {
              const activeStyle =
                rating === selectedRating ? styles.activeRating : {};
              const handlePress = () => onRatingPress(rating);

              return (
                <TouchableWithoutFeedback key={rating} onPress={handlePress}>
                  <Text style={[styles.rating, activeStyle]}>{rating}</Text>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
          <Button size="small" onPress={onArchiveConfirm}>
            Archive
          </Button>
          <Button size="small" type="tertiary" onPress={onHideModal}>
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default ArchiveModal;

const styles = StyleSheet.create({
  modalInner: {
    backgroundColor: 'white',
    height: '50%',
    padding: 10,
    paddingBottom: 15,
    borderRadius: 20
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    justifyContent: 'center'
  },
  ratings: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  rating: {
    fontSize: 36,
    margin: 10
  },
  activeRating: {
    shadowColor: colors.textGrey,
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.7,
    elevation: 4,
    shadowRadius: 5
  }
});
