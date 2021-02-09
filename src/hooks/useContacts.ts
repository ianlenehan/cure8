import { useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';

import useCurrentUser from '@cure8/hooks/useCurrentUser';
import useFirestore from '@cure8/hooks/useFirestore';
import useBoolean from '@cure8/hooks/useBoolean';

const contactsState = atom({
  key: 'contactsState',
  default: [],
});

const groupsState = atom({
  key: 'groupsState',
  default: [],
});

const useContacts = () => {
  const [contacts, setContacts] = useRecoilState<any>(contactsState);
  const [groups, setGroups] = useRecoilState<any>(groupsState);

  const [loading, startLoading, stopLoading] = useBoolean();

  const [currentUser] = useCurrentUser();
  const { firestore, getCollection } = useFirestore();

  useEffect(() => {
    if (currentUser) {
      getContacts();
    }
  }, [currentUser]);

  const getGroups = async () => {
    const docRef = firestore().collection('groups').where('ownerId', '==', currentUser.id);
    const res = await getCollection(docRef);
    setGroups(res);
  };

  const getContacts = async () => {
    startLoading();
    const docRef = firestore().collection('contacts').where('ownerId', '==', currentUser.id);
    const res = await getCollection(docRef);
    setContacts(res);

    await getGroups();
    stopLoading();
  };

  return { contacts, groups, loading };
};

export default useContacts;
