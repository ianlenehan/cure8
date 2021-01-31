import { useState } from 'react'
import firestore from '@react-native-firebase/firestore';

import useBoolean from '@cure8/hooks/useBoolean';

const useFirestore = () => {
  const [error, setError] = useState();
  const [loading, startLoading, stopLoading] = useBoolean(true);

  const getCollection = async (docRef: any) => {
    startLoading();

    try {
      const docSnapshot = await docRef.get();

      return docSnapshot.docs.map((doc: any) => {
        return { ...doc.data(), id: doc.id };
      });
    } catch (e) {
      console.error('Get collection error', e);
      setError(e);
    }

    stopLoading();
  };

  const getDocument = async (docRef: any) => {
    startLoading();

    try {
      const docSnapshot = await docRef.get();
      return { ...docSnapshot.data(), id: docSnapshot.id, exists: docSnapshot.exists };
    } catch (e) {
      console.error(e);
      setError(e);
    }

    stopLoading();
  };

  return { firestore, loading, error, getCollection, getDocument };
};

export default useFirestore