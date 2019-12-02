import React, { FunctionComponent } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

type Props = {
  chevronType?: string;
  contactId: string;
  editMode: boolean;
  iconColour?: string;
  iconType?: string;
  isGroup?: boolean;
  isMember?: boolean;
  onDeletePress?: () => void;
  onEditPress?: () => void;
  rightTitle: string;
  subtitle?: string;
  title: string;
};

const ContactRow: FunctionComponent<Props> = props => {
  const {
    chevronType,
    editMode,
    iconColour,
    iconType,
    isGroup,
    isMember,
    onDeletePress,
    onEditPress,
    rightTitle,
    subtitle,
    title
  } = props;

  const getRightTitle = () => {
    if (editMode && isGroup) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Icon
            name="mode-edit"
            color="#ddd"
            onPress={onEditPress}
            containerStyle={{ paddingRight: 15 }}
          />
          <Icon
            name="trash-o"
            type="font-awesome"
            color="#ddd"
            onPress={onDeletePress}
          />
        </View>
      );
    } else if (editMode) {
      return (
        <Icon
          name="trash-o"
          type="font-awesome"
          color="#ddd"
          onPress={onDeletePress}
        />
      );
    } else if (rightTitle) {
      return <Text style={styles.rightTitle}>{rightTitle}</Text>;
    }
    return (
      <Icon
        name={chevronType || 'chevron-right'}
        type={iconType}
        color={iconColour || '#f3f3f3'}
      />
    );
  };

  const formatName = () => {
    if (title && isMember) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>{title || ''}</Text>
          <Icon
            name="check-circle"
            size={14}
            color="#27ae60"
            containerStyle={{ marginTop: 4 }}
          />
        </View>
      );
    }
    return <Text style={styles.title}>{title || ''}</Text>;
  };

  return (
    <View style={styles.card}>
      <View style={styles.details}>
        {formatName()}
        <Text style={styles.subtitle}>{subtitle}</Text>
        {getRightTitle()}
      </View>
    </View>
  );
};

export default ContactRow;

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderColor: '#ddd',
    borderBottomWidth: 1
  },
  title: {
    fontSize: 16,
    paddingTop: 3,
    paddingRight: 5
  },
  subtitle: {
    fontSize: 12,
    color: '#ddd'
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10
  },
  rightTitle: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 5,
    alignItems: 'flex-end'
  }
});
