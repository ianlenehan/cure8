import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import moment from 'moment';
import { AppText } from '../common';

type Props = {
  image: string;
  title: string;
  comment?: string;
  date: any;
  curatedBy: string;
};

const Card: FunctionComponent<Props> = ({
  image,
  title,
  comment,
  date,
  curatedBy
}) => {
  const formatDate = (date: string) => {
    const currentDate = new Date();
    return moment(date)
      .local()
      .from(currentDate);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.textArea}>
        <AppText size="medium" style={styles.centredText}>
          {title}
        </AppText>
        {comment ? (
          <AppText size="small" style={styles.subtitle}>
            "{comment}"
          </AppText>
        ) : null}
        <Text style={styles.date}>{`${formatDate(
          date
        )} from ${curatedBy}`}</Text>
      </View>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 5,
    marginTop: 5,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  image: {
    height: 220,
    paddingBottom: 5
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
  }
});
