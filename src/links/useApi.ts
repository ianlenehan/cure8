import { useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { atom, useRecoilState } from 'recoil';
import faker from 'faker';

import useFirestore from '@cure8/hooks/useFirestore';
import useBoolean from '@cure8/hooks/useBoolean';
import useCurrentUser from '@cure8/hooks/useCurrentUser';

import { ArchiveVariablesType, CurationType } from './types';

const linksState = atom({
  key: 'linksState',
  default: [],
});

const archivedLinksState = atom({
  key: 'archivedLinksState',
  default: [],
});

const useApiLinks = () => {
  const [currentUser] = useCurrentUser();

  const [links, setLinks] = useRecoilState(linksState);
  const [loadingLinks, startLoadingLinks, stopLoadingLinks] = useBoolean(false);

  const [archivedLinks, setArchivedLinks] = useRecoilState(archivedLinksState);
  const [loadingArchivedLinks, startLoadingArchivedLinks, stopLoadingArchivedLinks] = useBoolean(false);

  const { firestore, getCollection } = useFirestore();

  const getLinks = useCallback(async () => {
    try {
      startLoadingLinks();
      const docRef = firestore()
        .collection('curations')
        .orderBy('date', 'desc')
        .where('phoneNumber', '==', currentUser.phoneNumber)
        .where('status', '==', 'new');
      const res = await getCollection(docRef);
      setLinks(res);
      stopLoadingLinks();
    } catch (error) {
      stopLoadingLinks();
      console.error(error);
      Alert.alert('Error', 'There was an error loading your links');
    }
  }, [currentUser.phoneNumber, firestore, getCollection, setLinks, startLoadingLinks, stopLoadingLinks]);

  const getArchivedLinks = async () => {
    try {
      startLoadingArchivedLinks();
      const docRef = firestore()
        .collection('links')
        .where('userId', '==', currentUser.id)
        .where('status', '==', 'archived');
      const res = await getCollection(docRef);
      setArchivedLinks(res);
      stopLoadingArchivedLinks();
    } catch (error) {
      stopLoadingArchivedLinks();
      console.error(error);
      Alert.alert('Error', 'There was an error loading your archived links');
    }
  };

  useEffect(() => {
    getLinks();
  }, []);

  type SaveCurationTypes = {
    url: string;
    comment: string;
    saveToMyLinks: boolean;
    selectedContacts: { phoneNumber: number; name: string }[];
  };

  const saveCuration = async ({ url, comment = '', saveToMyLinks, selectedContacts }: SaveCurationTypes) => {
    const linksRef = firestore().collection('links');
    const curationsRef = firestore().collection('curations');
    const curationsBatch = firestore().batch();

    const status = 'new';
    const date = new Date();
    const curatorName = `${currentUser.firstName} ${currentUser.lastName}`;

    const sharedData = { date, url, comment, status };

    try {
      const linkDocRef = linksRef.where('url', '==', url).where('ownerId', '==', currentUser.id);
      const [existingLink] = await getCollection(linkDocRef);
      let linkId = existingLink?.id;
      if (!existingLink) {
        linkId = faker.random.uuid();
        await linksRef.doc(linkId).set({ curatorId: currentUser.id, curatorName, url, date });
      }

      if (saveToMyLinks) {
        const data = { phoneNumber: currentUser.phoneNumber, curatorId: currentUser.id, linkId, ...sharedData };
        const curationId = faker.random.uuid();
        curationsBatch.set(curationsRef.doc(curationId), data);
      }

      selectedContacts.forEach((contact) => {
        const data = { phoneNumber: contact.phoneNumber, curatorId: currentUser.id, linkId, ...sharedData };
        const curationId = faker.random.uuid();
        curationsBatch.set(curationsRef.doc(curationId), data);
      });

      await curationsBatch.commit();
      getLinks();
    } catch (error) {
      console.error(error);
    }
  };

  const archiveLink = ({ id, tags, rating }: ArchiveVariablesType) => {};

  const loading = loadingLinks || loadingArchivedLinks;

  return { archiveLink, archivedLinks, links, loading, getLinks, getArchivedLinks, saveCuration };
};

export default useApiLinks;

// productCategoriesQuery.forEach(async (doc) => {
//   let productCategory = doc.data();
//   let pcDocId = `sv_${pcId}_${newOrganisationId}`;
//   let pcRef = db.collection('productCategories').doc(pcDocId);
//   let newProductCategory = {
//     ...productCategory,
//     organisationId: newOrganisationId,
//   };
//   pcBatch.set(pcRef, newProductCategory);
//   pcId = pcId + 1;
// });

// await pcBatch.commit();
