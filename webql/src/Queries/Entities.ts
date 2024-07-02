import {graphql} from 'react-relay';

export const EntitiesAllSamQuery = graphql`
  query EntitiesAllSamQuery {
    SamEntities {
        name
        id
        cageCode
    }
}
`;