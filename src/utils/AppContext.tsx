import React from 'react';
import { analytics } from 'react-native-firebase';

const AppContext = React.createContext({
  authUser: {
    uid: '',
    phoneNumber: '',
    displayName: '',
    updateProfile: ({  }: any) => {}
  },
  setAuthUser: (authUser: any) => {},
  currentUser: {
    id: '',
    name: '',
    pushToken: ''
  },
  setCurrentUser: (currentUser: any) => {},
  newContact: {
    familyName: '',
    givenName: '',
    phoneNumbers: []
  },
  setNewContact: (contact: any) => {},
  selectedConversationId: '',
  setSelectedConversationId: (conversationId: string) => {}
});

export default AppContext;
