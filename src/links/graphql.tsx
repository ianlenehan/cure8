import gql from 'graphql-tag';

export const FETCH_NEW_LINKS = gql`
  query curations {
    curations {
      id
      createdAt
      curatorName
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
  query archivedCurations {
    archivedCurations {
      id
      createdAt
      curatorName
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
