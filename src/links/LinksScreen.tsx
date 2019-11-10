import React, { FunctionComponent, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useQuery } from 'react-apollo';
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

type Curation = {
  id: string;
  link: { title: string; image: string };
  comment?: string;
  date: any;
};

const LinksScreen: NavigationBottomTabScreenComponent<
  NavigationTabScreenProps
> = ({ navigation }) => {
  const { data, loading, error } = useQuery(FETCH_LINKS);
  console.log({ data, loading, error });

  const handleNewLinkPress = () => {
    navigation.navigate('NewLink');
  };

  const PlusIcon = () => (
    <View style={styles.plusIconContainer}>
      <Icon
        color={colors.primaryGreen}
        reverse
        containerStyle={styles.plusIcon}
        name="plus"
        type="font-awesome"
        onPress={handleNewLinkPress}
      />
    </View>
  );

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
      <FlatList
        data={data.curations}
        renderItem={renderCurations}
        keyExtractor={item => item.id.toString()}
        removeClippedSubviews={false}
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
  }
});
