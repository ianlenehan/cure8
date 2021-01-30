import { gql } from '@apollo/client';

/* **************** QUERIES **************** */

export const FETCH_NEW_LINKS = gql`
  query Curations($showItemCount: Int!) {
    curations(status: "new", tagIds: [], showItemCount: $showItemCount) {
      id
      createdAt
      curatorName
      curatorId
      comment
      link {
        id
        image
        title
        url
      }
      sharedWith {
        id
        name
        phone
      }
    }
    hasMorePages: curationsPageInfo(
      status: "new"
      tagIds: []
      showItemCount: $showItemCount
    )
  }
`;

export const FETCH_ARCHIVED_LINKS = gql`
  query ArchivedCurations($tagIds: [String!], $showItemCount: Int!) {
    curations(
      status: "archived"
      tagIds: $tagIds
      showItemCount: $showItemCount
    ) {
      id
      createdAt
      curatorName
      curatorId
      comment
      tags {
        id
        name
      }
      rating
      link {
        id
        image
        title
        url
      }
      sharedWith {
        id
        name
        phone
      }
    }
    hasMorePages: curationsPageInfo(
      status: "archived"
      tagIds: $tagIds
      showItemCount: $showItemCount
    )
  }
`;

export const FETCH_TAGS = gql`
  query Tags {
    tags {
      id
      name
    }
  }
`;

/* **************** MUTATIONS **************** */

export const DELETE_CURATION = gql`
  mutation DeleteCuration($id: String!) {
    deleteCuration(id: $id) {
      curations {
        id
      }
    }
  }
`;

export const ARCHIVE_CURATION = gql`
  mutation ArchiveCuration($id: String!, $rating: String, $tags: [String!]) {
    archiveCuration(id: $id, rating: $rating, tags: $tags) {
      curations {
        id
      }
    }
  }
`;

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation($linkId: String!, $userIds: [String!]!) {
    createConversation(linkId: $linkId, userIds: $userIds) {
      conversation {
        id
        title
      }
    }
  }
`;
