import React, { FunctionComponent } from 'react';
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
  isOpen: boolean;
  onCancel: () => void;
  onPress?: () => void;
  saveDisabled?: boolean;
  fullscreen?: boolean;
  hideMainButton?: boolean;
  loading?: boolean;
};

const Overlay: FunctionComponent<Props> = props => {
  const {
    buttonText,
    children,
    isOpen,
    onCancel,
    onPress,
    onSave,
    fullscreen,
    hideMainButton,
    saveDisabled,
    loading
  } = props;

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress && onPress();
  };

  const handleCancel = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onCancel();
  };

  const height = fullscreen ? '95%' : '85%';

  if (hideMainButton && !isOpen) return null;

  return (
    <View
      style={[
        isOpen && {
          height
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
      {isOpen && (
        <View style={styles.overlayInner}>
          {children}
          <View>
            {onSave && (
              <Button
                size="small"
                type="primary"
                onPress={onSave}
                loading={loading}
                disabled={saveDisabled}>
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
