import React, { FunctionComponent, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';
import gql from 'graphql-tag';
import {
  NavigationBottomTabScreenComponent,
  NavigationTabScreenProps
} from 'react-navigation-tabs';
import { AppText, Button, Spacer, colors, Spinner } from '../common';
import IonIcon from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import Card from './Card';
import AppContext from '../utils/AppContext';

import { SwipeListView } from 'react-native-swipe-list-view';

const FETCH_LINKS = gql`
  query curations {
    curations {
      id
      link {
        id
        image
        title
        url
      }
    }
  }
`;

const DELETE_CURATION = gql`
  mutation DeleteCuration($id: String!) {
    deleteCuration(id: $id) {
      curations {
        id
      }
    }
  }
`;

type Curation = {
  id: string;
  link: { title: string; image: string };
  comment?: string;
  date: any;
};

const LinksScreen: NavigationBottomTabScreenComponent<NavigationTabScreenProps> = ({
  navigation
}) => {
  const [openRows, setOpenRows] = useState<string[]>([]);
  const [opacity, setOpacity] = useState(new Animated.Value(1));
  const { data, loading, error, refetch } = useQuery(FETCH_LINKS);

  const togglePlusIcon = (direction: 'show' | 'hide') => {
    const toValue = direction === 'show' ? 1 : 0;
    Animated.timing(opacity, {
      toValue,
      duration: 200
    }).start();
  };

  const handleNewLinkPress = () => {
    navigation.navigate('NewLink');
  };

  const handleScrollEnabled = (rowKey: string) => {
    setOpenRows(openRows => [...openRows, rowKey]);

    togglePlusIcon('hide');
  };

  const handleRowDidClose = (rowKey: string) => {
    const newOpenRows = openRows.filter(row => row !== rowKey);
    setOpenRows(newOpenRows);

    if (!newOpenRows.length) {
      togglePlusIcon('show');
    }
  };

  const [deleteCuration] = useMutation(DELETE_CURATION);

  const handleDeletePress = async (curationId: string) => {
    await deleteCuration({ variables: { id: curationId } });
    setOpenRows([]);
    refetch();
  };

  const PlusIcon = () => {
    return (
      <Animated.View style={[styles.plusIconContainer, { opacity }]}>
        <Icon
          color={colors.secondaryPink}
          reverse
          containerStyle={styles.plusIcon}
          name="plus"
          type="font-awesome"
          onPress={handleNewLinkPress}
        />
      </Animated.View>
    );
  };

  const renderHiddenItem = ({ item }: { item: Curation }) => {
    return (
      <View style={styles.rowBack}>
        <View></View>
        <View style={styles.rightBack}>
          <Icon
            color={colors.secondaryPink}
            name="trash"
            type="font-awesome"
            onPress={() => handleDeletePress(item.id)}
          />
          <Icon
            color={colors.secondaryPink}
            name="archive"
            type="font-awesome"
            onPress={handleNewLinkPress}
          />
          <Icon
            color={colors.secondaryPink}
            name="share"
            type="font-awesome"
            onPress={handleNewLinkPress}
          />
        </View>
      </View>
    );
  };

  const renderCurations = ({ item }: { item: Curation }) => {
    return (
      <Card
        key={item.id}
        image={item.link.image}
        title={item.link.title}
        comment={item.comment}
        date={item.date}
      />
    );
  };

  if (loading) return <Spinner />;

  if (!data) {
    return (
      <View style={styles.container}>
        <AppText size="large">You have no new saved links!</AppText>
        <Spacer size={2} />
        <IonIcon.Button
          name="plus-square"
          backgroundColor={colors.primaryGreen}
          onPress={handleNewLinkPress}>
          Create One
        </IonIcon.Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SwipeListView
        data={data.curations}
        renderItem={renderCurations}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
        renderHiddenItem={renderHiddenItem}
        disableRightSwipe
        rightOpenValue={-80}
        onRowDidOpen={handleScrollEnabled}
        onRowDidClose={handleRowDidClose}
      />

      <PlusIcon />
    </View>
  );
};

export default LinksScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1,
    backgroundColor: '#ecf0f1'
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end'
  },
  plusIcon: {
    opacity: 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2
  },
  scrollContainer: {
    flex: 1
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 30
  },
  rightBack: {
    justifyContent: 'space-around',
    flex: 1,
    alignItems: 'flex-end'
  }
});
