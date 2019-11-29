import React, { Component } from 'react';
import { AsyncStorage, FlatList, View, StyleSheet } from 'react-native';
import { useQuery } from 'react-apollo';
import gql from 'graphql-tag';

import { Container, AppText } from '../common';
import ContactRow from './ContactRow';
import NewContact from './NewContact';

const FETCH_CONTACTS = gql`
  query contacts {
    contacts {
      id
      name
      user {
        id
        name
      }
      linkedUser {
        id
        name
      }
    }
  }
`;

const ContactsScreen = ({ navigation }) => {
  const { data, error, loading } = useQuery(FETCH_CONTACTS);

  console.log({ data, error });
  // async componentDidMount() {
  //   this.props.navigation.setParams({
  //     setEditMode: this.setEditMode.bind(this),
  //     editMode: false,
  //   })
  //   this._setToken()
  // }

  // const onDeletePress = (contact) => {
  //   this.props.deleteContact(contact, this.state.token)
  // }

  // setEditMode = async () => {
  //   await this.props.setEditMode(this.props.editMode)
  //   this.props.navigation.setParams({
  //     editMode: this.props.editMode,
  //   })
  // }

  // const renderItem = ({ item }) => {
  //   return (
  //     <ContactRow
  //       contact={item}
  //       title={item.name}
  //       isMember={item.member}
  //       rightTitle={item.phone}
  //       onPress={() => {}}
  //       // editMode={this.props.editMode}
  //       // onDeletePress={() => this.onDeletePress(item)}
  //     />
  //   )
  // }

  // const renderContent = () => {
  //   if (loading) {
  //     return <Spinner size="large" text="Loading contacts..." />
  //   }
  //   return (
  //     <FlatList
  //       data={this.props.contacts}
  //       renderItem={this.renderItem}
  //       editMode={this.props.editMode}
  //       keyExtractor={item => item.id.toString()}
  //       removeClippedSubviews={false}
  //     />
  //   )
  // }

  return (
    <View style={styles.container}>
      <Container style={styles.pageContainer}>
        <AppText>No Contacts Yet</AppText>
      </Container>
      <NewContact {...{ navigation }} />
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-between'
  },
  pageContainer: {
    backgroundColor: 'white'
  }
});

// ContactsScreen.navigationOptions = ({ navigation }) => {
//   const { navigate } = navigation
//   const { params = {} } = navigation.state

//   return {
//     title: 'My Contacts',
//     headerRight: (
//       <Button
//         fontSize={14}
//         title={params.editMode ? 'Done' : 'Edit'}
//         backgroundColor="rgba(0,0,0,0)"
//         onPress={() => params.setEditMode()}
//       />
//     ),
//     headerLeft: (
//       <Button
//         fontSize={14}
//         icon={{ name: 'users', type: 'font-awesome' }}
//         iconLeft
//         backgroundColor="rgba(0,0,0,0)"
//         onPress={() => navigate('myGroups')}
//       />
//     ),
//   }
// }
