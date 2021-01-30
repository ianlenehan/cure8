import React from 'react';
import { useQuery, useMutation } from '@apollo/client';

import useAppContext from '../../hooks/useAppContext';
import useToast from '../../hooks/useToast';
import Links from './Links';
import { ArchiveVariablesType, CurationType, TagType } from '../types';

import {
  ARCHIVE_CURATION,
  CREATE_CONVERSATION,
  DELETE_CURATION,
  FETCH_TAGS
} from '../graphql';

type Props = {
  curations: [CurationType];
  fetchArchivedLinks?: () => void;
  filteredTagIds?: string[];
  isArchivedLinks?: boolean;
  navigation: any;
  onClearTagFilter?: () => void;
  onLoadMore: () => void;
  onTagPress?: (tag: TagType) => void;
  refetch: () => void;
};

const LoaderLinks = (props: Props) => {
  const {
    curations,
    fetchArchivedLinks,
    filteredTagIds,
    isArchivedLinks,
    navigation,
    onClearTagFilter,
    onLoadMore,
    onTagPress,
    refetch,
  } = props;

  const { data: tagsData, loading: loadingTags } = useQuery(FETCH_TAGS);
  const [archiveCuration] = useMutation(ARCHIVE_CURATION);
  const [deleteCuration] = useMutation(DELETE_CURATION);
  const [createConversation] = useMutation(CREATE_CONVERSATION);

  const { setSelectedConversationId, currentUser } = useAppContext();

  if (loadingTags) return null;

  const handleArchive = async (variables: ArchiveVariablesType) => {
    await archiveCuration({ variables });
    useToast('Curation successfully archived');
    refetch();
    fetchArchivedLinks && fetchArchivedLinks();
  };

  const handleDelete = async (id: string) => {
    await deleteCuration({ variables: { id } });
    useToast('Curation successfully deleted');
    refetch();
  };

  const handleCreateConversation = async (
    linkId: string,
    userIds: string[]
  ) => {
    const { data } = await createConversation({
      variables: { linkId, userIds }
    });
    setSelectedConversationId(data.createConversation.conversation.id);
    navigation.navigate('Conversations');
  };

  const tags = tagsData ? tagsData.tags : [];

  return (
    <Links
      {...{
        curations,
        filteredTagIds,
        isArchivedLinks,
        onClearTagFilter,
        onLoadMore,
        onTagPress,
        tags
      }}
      onCreateConversation={handleCreateConversation}
      onDelete={handleDelete}
      onNewLinkSubmit={refetch}
      currentUserId={currentUser?.id}
      onArchive={handleArchive}
    />
  );
};

export default LoaderLinks;
