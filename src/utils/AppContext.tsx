import React from 'react';

const AppContext = React.createContext({
  authUser: {
    uid: '',
    phoneNumber: '',
    displayName: ''
  }
});

export default AppContext;
