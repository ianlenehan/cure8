import React from 'react';
import { View, Text } from 'react-native';
import { useQuery, useMutation } from 'react-apollo';

import Links from './Links';
import { ArchiveVariablesType, CurationType, TagType } from '../types';

import {
  ARCHIVE_CURATION,
  CREATE_CONVERSATION,
  DELETE_CURATION,
  FETCH_TAGS,
  FETCH_CURRENT_USER
} from '../graphql';

type Props = {
  curations: [CurationType];
  refetch: () => void;
  isArchivedLinks?: boolean;
  onTagPress?: (tag: TagType) => void;
  onClearTagFilter?: () => void;
  filteredTagIds?: string[];
  fetchArchivedLinks?: () => void;
  setParams?: any;
};

const LoaderLinks = (props: Props) => {
  const {
    curations,
    fetchArchivedLinks,
    filteredTagIds,
    isArchivedLinks,
    onClearTagFilter,
    onTagPress,
    refetch,
    setParams
  } = props;
  const { data: currentUser, loading: loadingCurrentUser } = useQuery(
    FETCH_CURRENT_USER
  );

  const { data: tagsData, loading: loadingTags } = useQuery(FETCH_TAGS);
  const [archiveCuration] = useMutation(ARCHIVE_CURATION);
  const [deleteCuration] = useMutation(DELETE_CURATION);
  const [createConversation] = useMutation(CREATE_CONVERSATION);

  if (loadingCurrentUser || loadingTags) return null;

  const handleArchive = async (variables: ArchiveVariablesType) => {
    await archiveCuration({ variables });
    await refetch();
    fetchArchivedLinks && fetchArchivedLinks();
  };

  const handleDelete = async (id: string) => {
    await deleteCuration({ variables: { id } });
    refetch();
  };

  const handleCreateConversation = async (
    linkId: string,
    userIds: string[]
  ) => {
    const res = await createConversation({ variables: { linkId, userIds } });
    console.log('handleCreateConversation -> res', res);
  };

  const tags = tagsData ? tagsData.tags : [];

  return (
    <Links
      {...{
        curations,
        filteredTagIds,
        isArchivedLinks,
        onClearTagFilter,
        onTagPress,
        setParams,
        tags
      }}
      onCreateConversation={handleCreateConversation}
      onDelete={handleDelete}
      onNewLinkSubmit={refetch}
      currentUserId={currentUser.appUser.id}
      onArchive={handleArchive}
    />
  );
};

export default LoaderLinks;
