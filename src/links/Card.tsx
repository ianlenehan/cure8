import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { AppText, Tag } from '../common';

type TagType = {
  id: string;
  name: string;
};

type Props = {
  comment?: string;
  curatedBy: string;
  date: any;
  filteredTagIds: string[];
  image: string;
  onPress: () => void;
  onTagPress: (tag: TagType) => void;
  rating?: string;
  tags?: any;
  title: string;
};

const Card: FunctionComponent<Props> = ({
  comment,
  curatedBy,
  date,
  filteredTagIds = [],
  image,
  onPress,
  onTagPress,
  rating,
  tags,
  title
}) => {
  const formatDate = (date: string) => {
    const currentDate = new Date();
    return moment(date)
      .local()
      .from(currentDate);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity {...{ onPress }}>
        <Image source={{ uri: image }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.textArea}>
        <TouchableOpacity {...{ onPress }}>
          <AppText size="medium" style={styles.centredText}>
            {title}
          </AppText>
        </TouchableOpacity>
        {comment ? (
          <AppText size="small" style={styles.subtitle}>
            "{comment}"
          </AppText>
        ) : null}
        {tags &&
          tags.map((tag: TagType) => (
            <View style={styles.tagContainer} key={tag.id}>
              <Tag
                tag={tag}
                selected={filteredTagIds.includes(tag.id)}
                onPress={onTagPress}
              />
            </View>
          ))}
        <View style={styles.dateView}>
          <Text style={styles.date}>{`${formatDate(
            date
          )} from ${curatedBy}`}</Text>
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
    shadowRadius: 2
  },
  image: {
    height: 220,
    paddingBottom: 5,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  centredText: {
    textAlign: 'center'
  },
  subtitle: {
    fontWeight: '200',
    textAlign: 'center',
    marginTop: 8
  },
  date: {
    fontSize: 11,
    color: 'grey',
    flex: 1,
    marginTop: 10
  },
  textArea: {
    padding: 10
  },
  dateView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  tagContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
