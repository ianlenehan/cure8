import React, { Fragment, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import moment from 'moment';
import { get } from 'lodash';

import { Spinner } from '../common';
import WebViewer from '../links/WebViewer'; // TODO move this

const FETCH_ACTIVITY = gql`
  query activity {
    activity {
      id
      url
      title
      createdAt
      ratings {
        rating
        user
      }
    }
  }
`;

type Rating = {
  user?: string;
  rating?: string;
  id?: string;
};

type Item = {
  id: string;
  url: string;
  title: string;
  createdAt: string;
  ratings: Rating[];
};

const ActivityScreen = () => {
  const [selectedCuration, setSelectedCuration] = useState<Item | undefined>();

  const { data, loading } = useQuery(FETCH_ACTIVITY);

  if (loading) return <Spinner text="Loading recent activity..." />;

  const activity = get(data, 'activity', []);

  const handleWebViewerClose = () => setSelectedCuration(undefined);

  const renderSharedWith = (item: Item) => {
    const names = item.ratings
      .map(rating => {
        const ratingDisplay = rating.rating ? ` ${rating.rating}` : '';
        return `${rating.user}${ratingDisplay}`;
      })
      .join(', ');

    return <Text style={styles.userNames}>{names}</Text>;
  };

  const renderDate = (item: Item) => {
    const currentDate = moment();
    const formattedDate = moment(item.createdAt)
      .local()
      .from(currentDate);
    return <Text style={styles.date}>{formattedDate}</Text>;
  };

  const renderItems = () => {
    return activity.map((item: Item) => {
      const onPress = () => setSelectedCuration(item);
      return (
        <View key={item.createdAt} style={styles.itemContainer}>
          <TouchableOpacity style={styles.titleView} {...{ onPress }}>
            <Text style={styles.titleText}>{item.title}</Text>
            <View style={styles.dateAndNamesView}>
              {renderSharedWith(item)}
              {renderDate(item)}
            </View>
          </TouchableOpacity>
        </View>
      );
    });
  };

  return (
    <Fragment>
      <ScrollView style={styles.scrollView}>{renderItems()}</ScrollView>
      <WebViewer
        onRequestClose={handleWebViewerClose}
        curationUrl={get(selectedCuration, 'url') || ''}
      />
    </Fragment>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#ecf0f1'
  },
  itemContainer: {
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    marginBottom: 0,
    borderRadius: 5
  },
  titleView: {
    flexDirection: 'column'
  },
  titleText: {
    flex: 6,
    fontSize: 16
  },
  drawerContainer: {
    backgroundColor: 'white',
    paddingTop: 15
  },
  ratingView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  ratingText: {
    color: 'grey'
  },
  userNames: {
    color: 'grey',
    fontSize: 12,
    flex: 1
  },
  date: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 10
  },
  dateAndNamesView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  cure8Icon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 10,
    marginBottom: 5
  },
  loading: {
    flex: 1,
    justifyContent: 'center'
  }
});
