import {graphql} from 'react-relay';

export const EntitiesAllSamQuery = graphql`
  query EntitiesAllSamQuery ($first: Int = 10, $offset: Int = 0, $before: Cursor = null, $after: Cursor = null, $search: String = null){
    samEntities (first: $first, offset: $offset, before: $before, after: $after, search: $search) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      nodes {
        name
        id
        cageCode
      }
    }
}
`;