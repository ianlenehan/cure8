import React from 'react';

const AppContext = React.createContext({
  logout: () => {},
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
