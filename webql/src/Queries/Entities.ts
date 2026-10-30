import {graphql} from 'react-relay';

export const EntitiesAllSamQuery = graphql`
  query EntitiesAllSamQuery ($first: Int = 10, $offset: Int = 0, $before: Cursor = null, $after: Cursor = null, $search: String = null, $source: SearchSource = ELASTICSEARCH, $type: EntityType = null, $state: UsState = null, $status: RegistrationStatus = null){
    samEntities (first: $first, offset: $offset, before: $before, after: $after, search: $search, source: $source, type: $type, state: $state, status: $status) {
      totalCount
      totalSearch
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
        type
        uei
        city
        state
        status
      }
    }
}
`;