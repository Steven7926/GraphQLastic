import {graphql} from 'react-relay';

export const EntitiesAllSamQuery = graphql`
  query EntitiesAllSamQuery ($first: Int = 10, $offset: Int = 0, $before: Cursor = null, $after: Cursor = null){
    samEntities (first: $first, offset: $offset, before: $before, after: $after) {
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