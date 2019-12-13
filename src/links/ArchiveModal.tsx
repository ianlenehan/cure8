import React, { FunctionComponent, useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Modal } from 'react-native';

import { Button, Input, Tag } from '../common';
import { VoidTypeAnnotation } from '@babel/types';

type Props = {
  existingTags: string[];
  isVisible: boolean;
  onSaveNewTag: () => void;
  onTagChange: (value: string) => void;
  onTagPress: (tag: string) => void;
  onHideModal: () => void;
  tag: string;
  tags: string[];
};

const ArchiveModal: FunctionComponent<Props> = props => {
  const {
    existingTags,
    isVisible,
    onSaveNewTag,
    onTagChange,
    onTagPress,
    onHideModal,
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
                  selected={tags.includes(tag)}
                />
              ))}
            </View>
          </View>

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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
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
