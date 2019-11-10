import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import moment from 'moment';
import { AppText } from '../common';

type Props = {
  image: string;
  title: string;
  comment?: string;
  date: any;
};

const Card: FunctionComponent<Props> = ({ image, title, comment, date }) => {
  const formatDate = date => {
    const currentDate = moment();
    const dateString = moment(date)
      .local()
      .from(currentDate);
    return dateString[0].toUpperCase() + dateString.slice(1);
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.textArea}>
        <AppText size="medium" style={styles.titleStyle}>
          {title}
        </AppText>
        <Text style={styles.date}>{formatDate(date)}</Text>
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
  titleStyle: {
    textAlign: 'center'
  },
  date: {
    fontSize: 8,
    color: 'grey',
    flex: 1,
    marginTop: 10
  },
  textArea: {
    padding: 10
  }
});
