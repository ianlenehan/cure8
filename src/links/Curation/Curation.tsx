import React, { FC } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from 'react-native-elements';
import moment from 'moment';

import { AppText, Tag, colors } from '@cure8/common';
import { CurationType } from '@cure8/links/types';

import useApi from './useApi';

type TagType = {
  id: string;
  name: string;
};

type SharedWithType = {
  id: string;
  name: string;
  phone: string;
};

type Props = {
  curation: CurationType;
  onPress: () => void;
  // onTagPress: (tag: TagType) => void;
  rating?: string;
  tags?: any;
};

const Card: FC<Props> = (props) => {
  const {
    curation,
    onPress,
    // onTagPress,
    rating,
    tags,
  } = props;

  const { date, linkId, comment, url } = curation;

  const { curatorName, sharedWith = [], title, image, loading } = useApi(linkId);
  const filteredTagIds = [];

  if (loading) {
    return null;
  }

  const formatDate = (date: string) => {
    return moment(date).local().from(moment());
  };

  const handleShowSharedWith = () => {
    if (!sharedWith.length) return null;

    const sharedWithNames = sharedWith.map((user: any) => user.name || user.phone);

    const message = `This has also been shared with ${sharedWithNames.join(', ')}.`;
    Alert.alert('Shared With', message);
  };

  const renderSharedWith = () => {
    if (!sharedWith.length) return null;

    return (
      <View style={styles.sharedWith}>
        <Icon name="people" size={18} color={colors.darkerGreen} />
        <Text style={styles.count}> {sharedWith.length}</Text>
      </View>
    );
  };

  const renderTags = () => {
    if (!tags) return null;

    return (
      <View style={styles.tagContainer}>
        {tags.map((tag: TagType) => (
          <Tag key={tag.id} tag={tag} selected={filteredTagIds.includes(tag.id)} onPress={onTagPress} />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity {...{ onPress }}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </TouchableOpacity>
      <View style={styles.textArea}>
        <TouchableOpacity {...{ onPress }}>
          <AppText size="medium" style={styles.centredText}>
            {title || url}
          </AppText>
        </TouchableOpacity>
        {comment ? (
          <AppText size="small" style={styles.subtitle}>
            {`"${comment}"`}
          </AppText>
        ) : null}
        {renderTags()}
        <View style={styles.footer}>
          <TouchableWithoutFeedback onPress={handleShowSharedWith}>
            <View style={styles.footerLeft}>
              <Text style={styles.date}>{`${formatDate(date)} from ${curatorName}`}</Text>
              {renderSharedWith()}
            </View>
          </TouchableWithoutFeedback>
          <Text>{rating || ''}</Text>
        </View>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderBottomWidth: 0,
    borderColor: '#ddd',
    borderWidth: 0,
    elevation: 1,
    margin: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    height: 220,
    paddingBottom: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
  },
  centredText: {
    textAlign: 'center',
  },
  subtitle: {
    fontWeight: '200',
    textAlign: 'center',
    marginTop: 8,
  },
  date: {
    fontSize: 11,
    color: 'grey',
    marginRight: 10,
  },
  textArea: {
    padding: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  footerLeft: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  tagContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sharedWith: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontSize: 10,
    color: colors.darkerGreen,
  },
});
