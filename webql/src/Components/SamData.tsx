import { useState, useEffect } from 'react'

import { useQueryLoader, PreloadedQuery, usePreloadedQuery, UseQueryLoaderLoadQueryOptions } from 'react-relay';
import { EntitiesAllSamQuery } from '../Queries/Entities';
import { EntitiesAllSamQuery as QueryType, EntitiesAllSamQuery$data, EntitiesAllSamQuery$variables } from '../Queries/__generated__/EntitiesAllSamQuery.graphql';

export default function SamData() {

  const [query, setQuery] = useQueryLoader<QueryType>(EntitiesAllSamQuery)
  useEffect(() => {
    setQuery({})
  }, [])
  
  return (
    <div className='text-3xl'>
        Test
        {query &&
            <QueryData query={query} loader={setQuery}/>
        }
    </div>
  )
}

interface QueryDataProps {
  query: PreloadedQuery<QueryType>;
  loader: (
      variables: EntitiesAllSamQuery$variables,
      options?: UseQueryLoaderLoadQueryOptions | undefined
  ) => void;
} 

function QueryData({query, loader}: QueryDataProps) {

  const data = usePreloadedQuery(EntitiesAllSamQuery, query)
  console.log(data)
  
  return (
    <div>
        Testing
    </div>
  )
}
