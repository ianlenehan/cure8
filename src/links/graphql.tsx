import gql from 'graphql-tag';

export const FETCH_NEW_LINKS = gql`
  query curations {
    curations(status: "new", tagIds: []) {
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
    }
  }
`;

export const FETCH_ARCHIVED_LINKS = gql`
  query ArchivedCurations($tagIds: [String!]) {
    curations(status: "archived", tagIds: $tagIds) {
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
    }
  }
`;

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

export const FETCH_TAGS = gql`
  query Tags {
    tags {
      id
      name
    }
  }
`;

export const FETCH_CURRENT_USER = gql`
  query currentUser {
    appUser {
      id
      name
    }
  }
`;
