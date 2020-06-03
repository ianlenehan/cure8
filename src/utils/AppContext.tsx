import React from 'react';

const AppContext = React.createContext({
  authUser: {
    uid: '',
    phoneNumber: '',
    displayName: '',
    updateProfile: ({  }: any) => {}
  },
  setAuthUser: (authUser: any) => {},
  newContact: {},
  setNewContact: (contact: any) => {},
  selectedConversationId: '',
  setSelectedConversationId: (conversationId: string) => {}
});

export default AppContext;
