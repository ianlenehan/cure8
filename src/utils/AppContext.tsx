import React from 'react';

const AppContext = React.createContext({
  authUser: {
    uid: '',
    phoneNumber: '',
    displayName: ''
  },
  newContact: {
    familyName: '',
    givenName: '',
    phoneNumbers: []
  },
  setNewContact: (contact: any) => {}
});

export default AppContext;
