import React from 'react';
import { Text, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const ContactRow = props => {
  const { contact, onPress, subtitle } = props;

  const getRightTitle = () => {
    if (props.editMode && props.group) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Icon
            name="mode-edit"
            color="#ddd"
            onPress={props.onEditPress}
            containerStyle={{ paddingRight: 15 }}
          />
          <Icon
            name="trash-o"
            type="font-awesome"
            color="#ddd"
            onPress={props.onDeletePress}
          />
        </View>
      );
    } else if (props.editMode) {
      return (
        <Icon
          name="trash-o"
          type="font-awesome"
          color="#ddd"
          onPress={props.onDeletePress}
        />
      );
    } else if (props.rightTitle) {
      return <Text style={styles.rightTitle}>{props.rightTitle}</Text>;
    }
    return (
      <Icon
        name={props.chevronType || 'chevron-right'}
        type={props.iconType}
        color={props.iconColour || '#f3f3f3'}
      />
    );
  };

  const formatName = () => {
    if (props.title && props.isMember) {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.title}>{props.title || ''}</Text>
          <Icon
            name="check-circle"
            size={14}
            color="#27ae60"
            containerStyle={{ marginTop: 4 }}
          />
        </View>
      );
    }
    return <Text style={styles.title}>{props.title || ''}</Text>;
  };

  return (
    <TouchableWithoutFeedback onPress={() => onPress(contact)}>
      <View style={styles.card}>
        <View style={styles.details}>
          {formatName()}
          <Text style={styles.subtitle}>{subtitle}</Text>
          {getRightTitle()}
        </View>
      </View>
    </TouchableWithoutFeedback>
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
