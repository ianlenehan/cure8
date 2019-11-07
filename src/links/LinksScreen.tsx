import React, { FunctionComponent, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';
import { AppText, Button, Spacer, colors, Spinner } from '../common';
import Icon from 'react-native-vector-icons/FontAwesome';
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

type Props = {
  navigation: any;
};

const LinksScreen: FunctionComponent<Props> = ({ navigation }) => {
  const { data, loading, error } = useQuery(FETCH_LINKS);
  console.log({ data, loading, error });

  const handleNewLinkPress = () => {
    navigation.navigate('NewLink');
  };

  if (loading) return <Spinner />;

  if (!data) {
    return (
      <View style={styles.container}>
        <AppText size="large">You have no new saved links!</AppText>
        <Spacer size={2} />
        <Icon.Button
          name="plus-square"
          backgroundColor={colors.primaryGreen}
          onPress={handleNewLinkPress}>
          Create One
        </Icon.Button>
      </View>
    );
  }

  return (
    <View>
      {data.curations.map((curation: { link: { title: string } }) => (
        <AppText>{curation.link.title}</AppText>
      ))}
      <Icon.Button
        name="plus-square"
        backgroundColor={colors.primaryGreen}
        onPress={handleNewLinkPress}>
        Create One
      </Icon.Button>
    </View>
  );
};

export default LinksScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
});
