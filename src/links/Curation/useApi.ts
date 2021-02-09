import { useState, useEffect, useRef } from 'react';

import useFirestore from '@cure8/hooks/useFirestore';

import { LinkType } from '@cure8/links/types';

const useApiCuration = (linkId: string) => {
  const { firestore, getDocument } = useFirestore();
  const [loading, setLoading] = useState(false);

  const [link, setLink] = useState<LinkType | undefined>();
  const { curatorName, title, image } = link || {};

  const timerRef = useRef<number | undefined>();

  const getLink = async (shouldLoad: boolean) => {
    try {
      setLoading(shouldLoad);
      const docRef = firestore().collection('links').doc(linkId);
      const res = await getDocument(docRef);
      setLink(res);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('There was an error fetching the link', error);
    }
  };

  useEffect(() => {
    getLink(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!link?.title) {
      const timer: number = window.setTimeout(() => {
        getLink(false);
      }, 1000);

      timerRef.current = timer;
    } else {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, [link?.title]);

  return { curatorName, loading, title, image };
};

export default useApiCuration;
