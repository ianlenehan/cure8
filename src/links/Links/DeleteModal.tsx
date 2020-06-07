import React from 'react';
import { View, StyleSheet, Modal } from 'react-native';

import { AppText, Button } from '../../common';

type Props = {
  isVisible: boolean;
  onDeleteConfirm: () => void;
  onDismiss: () => void;
};

const DeleteModal = (props: Props) => {
  const { isVisible, onDeleteConfirm, onDismiss } = props;

  return (
    <Modal animationType="fade" visible={isVisible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalInner}>
          <AppText size="large" style={{ textAlign: 'center' }}>
            Are you sure you want to delete this curation?
          </AppText>
          <View>
            <Button size="small" type="warning" onPress={onDeleteConfirm}>
              Yes
            </Button>
            <Button size="small" onPress={onDismiss}>
              No
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
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
  }
});
