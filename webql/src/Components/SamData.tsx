import { useState, useEffect, useTransition } from 'react'
import '../App.css'
import { useQueryLoader, PreloadedQuery, usePreloadedQuery, UseQueryLoaderLoadQueryOptions } from 'react-relay';
import { EntitiesAllSamQuery } from '../Queries/Entities';
import { EntitiesAllSamQuery as QueryType, EntitiesAllSamQuery$data, EntitiesAllSamQuery$variables } from '../Queries/__generated__/EntitiesAllSamQuery.graphql';
// Global amount to show per page
// Per Query is the amount of documents to load into the users browser at one time, in this example, 
// we are querying for 50 records and showing 10 at a time on each page, when the user hits page 6,
// a new query is run to get the next 50
const perQuery = 50
const perPage = 10

export default function SamData() {

  const [query, setQuery] = useQueryLoader<QueryType>(EntitiesAllSamQuery)
  useEffect(() => {
    setQuery({first: perQuery})
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

  const [pages, setPages] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sequence, setSequence] = useState<number>(1);

  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  console.log(data)
  
  const hitIt = (pageSelected: number, lastInList: boolean = false) => {

    setSequence(pages.indexOf(pageSelected + 1))
    setCurrentPage(pageSelected)

    if (lastInList){
      setPages([...Array(6).keys()].map(i => i + pages[pages.length - 1]))
      setSequence(1)
      startTransition(()  => {
        loader({first: perQuery, after: data.samEntities?.pageInfo.endCursor, search: searchTerm})
      })
    }
  }

  const goBackwards = (firstInList: boolean = false) => {

    if (firstInList){
      startTransition(()  => {
        loader({first: perQuery, before: data.samEntities?.pageInfo.startCursor, search: searchTerm })
      })
      console.log("hit")
      setPages(pages.map(i => (i-pages.length) + 1))
      setSequence(pages.length - 1)
      setCurrentPage(currentPage-1)
    }
    else {
      setSequence(pages.indexOf((currentPage-1) + 1))
      setCurrentPage(currentPage-1)
    }

  }
  
  const onSearch = (value: string) => {
    setSearchTerm(value)
    startTransition(()  => {
      loader({first: perPage, search: value})
    })


    const showPages = data.samEntities?.totalSearch ? Math.ceil(data.samEntities?.totalSearch / 10) : 0     
    if (data.samEntities?.totalSearch && data.samEntities.totalSearch <= 50){
      console.log((showPages))
      let newPages = []
      for ( let i=1; i < showPages; i++ )
        newPages[i] = i
      setPages(newPages)
    }
  }

  return (
    <div>
      <input placeholder='Search...' onChange={(e) => onSearch(e.target.value)}/>
      {data.samEntities && (
        <div>
          <table>
            <thead>
              <tr>
              
                {Object.keys(data.samEntities.nodes[0]).map((key) => {
                  return <th key={key.toString()}>{key[0].toUpperCase() + key.substring(1)}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {
                data.samEntities?.nodes.slice((sequence-1) * perPage, ((sequence-1) * perPage) + perPage).map((entity) => {
                  return (
                    <tr key={entity.name}>
                      <td>{entity.name}</td>
                      <td>{entity.id}</td>
                      <td>{entity.cageCode}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div className='remove-highlight'>
            {currentPage > 1 && <span className="pointer margin-right-5" onClick={() => currentPage == pages[0] ? goBackwards(true) : goBackwards()}>{"<="}</span>}
            {(data.samEntities.totalCount > 10 &&  data.samEntities.nodes.length >= 10) &&
              pages.map((num) => {
                if (num == 6 && pages.length > 5)
                  return <span key={num.toString()} className={`pointer ${num == currentPage ? 'brightgreen' : undefined}`} onClick={() => hitIt(num, true)}>{num+ "..."}</span>
                else
                  return <span key={num.toString()} className={`pointer ${num == currentPage ? 'brightgreen' : undefined}`} onClick={() => hitIt(num)}>{num + " "}</span>
              })  
            }
            {/* {data.samEntities.nodes.length >=10 && <span className="pointer" onClick={() => hitIt(amountOfPages)}>{amountOfPages}</span>} */}
          </div>
        </div>
      )}
    </div>
  )
}
