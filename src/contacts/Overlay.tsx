import React, { useState, useEffect, FunctionComponent } from 'react';
import {
  View,
  LayoutAnimation,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';
import { Button, colors, AppText } from '../common';

type Props = {
  buttonText: string;
  onSave?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
};

const Overlay: FunctionComponent<Props> = ({
  children,
  buttonText,
  isOpen,
  onSave = () => {},
  onClose = () => {}
}) => {
  const [isShowing, setShowing] = useState(false);

  useEffect(() => {
    if (isOpen && !isShowing) {
      handlePress();
    }
  }, [isOpen]);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowing(true);
  };

  const handleCancel = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowing(false);
    onClose();
  };

  const handleSave = () => {
    onSave();
    handleCancel();
  };

  return (
    <View
      style={[
        isShowing && {
          height: '85%'
        },
        styles.overlay
      ]}>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={styles.button}>
          <AppText style={styles.buttonText} size="large">
            {buttonText}
          </AppText>
        </View>
      </TouchableWithoutFeedback>
      {isShowing && (
        <View style={styles.overlayInner}>
          {children}
          <View>
            {onSave && (
              <Button size="small" type="primary" onPress={onSave}>
                Save
              </Button>
            )}
            <Button size="small" type="tertiary" onPress={handleCancel}>
              Close
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.backgroundGrey,
    padding: 10,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  overlayInner: {
    flex: 1,
    justifyContent: 'space-between'
  },
  button: {
    padding: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: colors.tertiaryBlue
  }
});

export default Overlay;
