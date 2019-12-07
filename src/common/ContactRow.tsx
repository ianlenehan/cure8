import React, { FunctionComponent } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';

import { AppText, colors } from '../common';

type Props = {
  chevronType?: string;
  disabled?: boolean;
  editMode?: boolean;
  iconColour?: string;
  iconType?: string;
  isGroup?: boolean;
  isMember?: boolean;
  onDeletePress?: () => void;
  onEditPress?: () => void;
  onPress?: () => void;
  rightIcon?: any;
  rightTitle?: string;
  subtitle?: string;
  title: string;
};

const ContactRow: FunctionComponent<Props> = props => {
  const {
    chevronType,
    disabled,
    editMode,
    iconColour,
    iconType,
    isGroup,
    isMember,
    onDeletePress,
    onEditPress,
    onPress,
    rightTitle,
    rightIcon,
    subtitle,
    title
  } = props;

  const getRightTitle = () => {
    if (editMode && isGroup) {
      return (
        <View style={styles.row}>
          <Icon
            name="mode-edit"
            color="#ddd"
            onPress={onEditPress}
            disabled={disabled}
            containerStyle={{ paddingRight: 15 }}
          />
          <Icon
            name="trash-o"
            type="font-awesome"
            color={colors.warningRed}
            onPress={onDeletePress}
            disabled={disabled}
          />
        </View>
      );
    } else if (editMode) {
      return (
        <Icon
          name="trash-o"
          type="font-awesome"
          color={colors.warningRed}
          onPress={onDeletePress}
          disabled={disabled}
        />
      );
    } else if (rightTitle) {
      return <Text style={styles.rightTitle}>{rightTitle}</Text>;
    } else if (rightIcon) {
      return rightIcon;
    }
    return (
      <Icon
        name={chevronType || 'chevron-right'}
        type={iconType}
        color={iconColour || '#f3f3f3'}
        disabled={disabled}
      />
    );
  };

  const formatName = () => {
    if (title && isMember) {
      return (
        <View style={styles.row}>
          <AppText size="large">{title || ''}</AppText>
          <Icon
            name="check-circle"
            size={14}
            color={colors.primaryGreen}
            containerStyle={{ marginLeft: 4 }}
          />
        </View>
      );
    }
    return <AppText size="large">{title || ''}</AppText>;
  };

  return (
    <View style={styles.card}>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.details}>
          <View>
            {formatName()}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {getRightTitle()}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ContactRow;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderColor: '#ddd',
    borderBottomWidth: 1,
    justifyContent: 'center'
  },
  subtitle: {
    fontSize: 12,
    color: colors.textGrey
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
  rightTitle: {
    fontSize: 12,
    color: colors.textGrey,
    marginTop: 5,
    alignItems: 'flex-end'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
