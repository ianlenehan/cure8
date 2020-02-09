import React, { FunctionComponent } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Button, colors } from '../common';

type Props = {
  curationUrl: string;
  onRequestClose: () => void;
};

const WebViewer: FunctionComponent<Props> = ({
  curationUrl,
  onRequestClose
}) => {
  const isVisible = !!curationUrl;
  return (
    <Modal visible={isVisible} animationType="slide">
      <View style={styles.pageContainer}>
        <View style={styles.header}>
          <Button onPress={onRequestClose} size="small">
            Close
          </Button>
        </View>
        <WebView source={{ uri: curationUrl }} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: colors.primaryGreen
  },
  header: {
    alignItems: 'flex-end',
    width: '100%',
    paddingRight: 20
  }
});

export default WebViewer;
