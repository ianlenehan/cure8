import React, { FunctionComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';

import { Button, Input, Tag, colors } from '../common';

const RATINGS = ['👍', '😂', '😢', '😲', '😡'];

type Props = {
  existingTags: string[];
  isVisible: boolean;
  onArchiveConfirm: () => void;
  onRatingPress: (rating: string) => void;
  onSaveNewTag: () => void;
  onTagChange: (value: string) => void;
  onTagPress: (tag: string) => void;
  onHideModal: () => void;
  selectedRating?: string;
  tag?: string;
  tags?: string[];
};

const ArchiveModal: FunctionComponent<Props> = props => {
  const {
    existingTags,
    isVisible,
    onArchiveConfirm,
    onRatingPress,
    onSaveNewTag,
    onTagChange,
    onTagPress,
    onHideModal,
    selectedRating,
    tag,
    tags
  } = props;

  return (
    <Modal animationType="fade" visible={isVisible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalInner}>
          <View style={{ flex: 1 }}>
            <Input
              label="Add tags"
              onChangeText={onTagChange}
              color="grey"
              autoCapitalize="none"
              small
            />
            {!!tag && (
              <Button onPress={onSaveNewTag} type="tertiary" size="small">
                Add New Tag: {tag}
              </Button>
            )}

            <View style={styles.tagContainer}>
              {existingTags.map(tag => (
                <Tag
                  tag={tag}
                  key={tag}
                  onPress={onTagPress}
                  selected={tags ? tags.includes(tag) : false}
                />
              ))}
            </View>
          </View>
          <View style={styles.ratings}>
            {RATINGS.map(rating => {
              const activeStyle =
                rating === selectedRating ? styles.activeRating : {};
              return (
                <TouchableWithoutFeedback
                  key={rating}
                  onPress={() => onRatingPress(rating)}>
                  <Text style={[styles.rating, activeStyle]}>{rating}</Text>
                </TouchableWithoutFeedback>
              );
            })}
          </View>
          <Button size="small" onPress={onArchiveConfirm}>
            Archive
          </Button>
          <Button size="small" type="secondary" onPress={onHideModal}>
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
    // borderTopRightRadius: 20
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flex: 1,
    justifyContent: 'center'
  },
  tagContainer: {
    borderTopWidth: 1,
    borderColor: '#dcdcdc',
    marginTop: 5,
    paddingTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap'
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
