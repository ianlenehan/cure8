import React from 'react';

const AppContext = React.createContext({
  logout: () => {},
  setCurrentUser: (currentUser: any) => {},
  newContact: {
    familyName: '',
    givenName: '',
    phoneNumbers: []
  },
  setNewContact: (contact: any) => {},
  selectedConversationId: '',
  setSelectedConversationId: (conversationId: string) => {},
  currentPushId: ''
});

export default AppContext;
