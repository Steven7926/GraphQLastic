import { useState, useEffect, useTransition } from 'react'
import '../App.css'
import { useQueryLoader, PreloadedQuery, usePreloadedQuery, UseQueryLoaderLoadQueryOptions } from 'react-relay';
import { EntitiesAllSamQuery } from '../Queries/Entities';
import { EntitiesAllSamQuery as QueryType, EntitiesAllSamQuery$data, EntitiesAllSamQuery$variables } from '../Queries/__generated__/EntitiesAllSamQuery.graphql';

// Global amount to show per page
const perPage = 10

export default function SamData() {

  const [query, setQuery] = useQueryLoader<QueryType>(EntitiesAllSamQuery)
  useEffect(() => {
    setQuery({first: perPage})
  }, [])
  
  return (
    <div className=''>
      <h1>Entities</h1>
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
  
  const total = data.samEntities?.totalCount ?? 0
  const amountOfPages: number = Math.ceil(total / perPage)

  const [ _, startTransition] = useTransition();

  const [pages, setPages] = useState<number[]>([1, 2, 3, 4, 5]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  console.log(data)

  const hitIt = (pageSelected: number, lastInList: boolean = false) => {
    
    const offsetNum = perPage * (pageSelected-1)
    startTransition(()  => {
      loader({first: perPage, offset: offsetNum})
    })
    setCurrentPage(pageSelected)

    if (lastInList)
      setPages([...Array(5).keys()].map(i => i + pages[pages.length - 1]))
  }
  
  return (
    data.samEntities && 
    <div>
        <table>
        <thead>
          <tr>
            {Object.keys(data.samEntities.nodes[0]).map((key) => {
              return <th>{key[0].toUpperCase() + key.substring(1)}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {
            data.samEntities.nodes.map((entity) => {
              return (
                <tr>
                  <td>{entity.id}</td>
                  <td>{entity.name}</td>
                  <td>{entity.cageCode}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <div>
        {pages.map((num) => {
          if (num == pages[pages.length - 1])
            return <span className={`pointer ${num == currentPage ? 'brightgreen' : undefined}`} onClick={() => hitIt(num, true)}>{num+ "..."}</span>
          else
            return <span className={`pointer ${num == currentPage ? 'brightgreen' : undefined}`} onClick={() => hitIt(num)}>{num + " "}</span>
        })
        }
        <span onClick={()  => hitIt(amountOfPages)}>{amountOfPages.toString()}</span>
      </div>
    </div>
  )
}
