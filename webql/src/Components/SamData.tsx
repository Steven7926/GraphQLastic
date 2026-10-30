import { useState, useEffect, useTransition } from 'react'
import '../App.css'
import { useQueryLoader, PreloadedQuery, usePreloadedQuery, UseQueryLoaderLoadQueryOptions } from 'react-relay';
import { EntitiesAllSamQuery } from '../Queries/Entities';
import { EntitiesAllSamQuery as QueryType, EntitiesAllSamQuery$variables, SearchSource, EntityType, UsState, RegistrationStatus } from '../Queries/__generated__/EntitiesAllSamQuery.graphql';
// Global amount to show per page
// Per Query is the amount of documents to load into the users browser at one time, in this example, 
// we are querying for 50 records and showing 10 at a time on each page, when the user hits page 6,
// a new query is run to get the next 50
const perQuery = 50
const perPage = 10
const searchDebounceMs = 300

const sources: { value: SearchSource, label: string }[] = [
  { value: 'ELASTICSEARCH', label: 'Elasticsearch' },
  { value: 'POSTGRES', label: 'Postgres' },
]

const entityTypes: { value: EntityType | null, label: string }[] = [
  { value: null, label: 'All' },
  { value: 'PERSON', label: 'Person' },
  { value: 'COMPANY', label: 'Company' },
]

const usStates: { value: UsState, label: string }[] = [
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'MD', label: 'Maryland' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
]

const statuses: { value: RegistrationStatus, label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'PENDING', label: 'Pending' },
]

interface Filters {
  type: EntityType | null
  state: UsState | null
  status: RegistrationStatus | null
}

const noFilters: Filters = { type: null, state: null, status: null }

export default function SamData() {

  const [query, setQuery] = useQueryLoader<QueryType>(EntitiesAllSamQuery)
  useEffect(() => {
    setQuery({first: perQuery})
  }, [])
  
  return (
    <div>
      <header className='page-header'>
        <h1>Entity Search</h1>
        <p>Search SAM entities through GraphQL, backed by Elasticsearch or Postgres full text search.</p>
      </header>
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
  
  const totalCount = data.samEntities?.totalCount ?? 0
  const totalSearch = data.samEntities?.totalSearch ?? 0
  const totalPages = Math.ceil(totalSearch / perPage)
  const pagesPerQuery = perQuery / perPage

  const [isPending, startTransition] = useTransition();

  const [pageStart, setPageStart] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState<string>('')
  const [source, setSource] = useState<SearchSource>('ELASTICSEARCH')
  const [filters, setFilters] = useState<Filters>(noFilters)

  const pages: number[] = []
  for (let page = pageStart; page <= Math.min(pageStart + pagesPerQuery, totalPages); page++) {
    pages.push(page)
  }

  const goToPage = (page: number) => {
    if (page >= pageStart + pagesPerQuery) {
      startTransition(()  => {
        setPageStart(page)
        setCurrentPage(page)
        loader({first: perQuery, after: data.samEntities?.pageInfo.endCursor, search: searchTerm, source, ...filters})
      })
    }
    else {
      setCurrentPage(page)
    }
  }

  const goBackwards = () => {
    if (currentPage == pageStart) {
      startTransition(()  => {
        setPageStart(pageStart - pagesPerQuery)
        setCurrentPage(currentPage - 1)
        loader({first: perQuery, before: data.samEntities?.pageInfo.startCursor, search: searchTerm, source, ...filters})
      })
    }
    else {
      setCurrentPage(currentPage - 1)
    }
  }

  const loadFirstPage = (variables: EntitiesAllSamQuery$variables) => {
    startTransition(()  => {
      setPageStart(1)
      setCurrentPage(1)
      loader({first: perQuery, ...variables})
    })
  }

  const onSearch = (value: string) => {
    setSearchTerm(value)
    loadFirstPage({search: value, source, ...filters})
  }

  useEffect(() => {
    if (inputValue === (searchTerm ?? '')) return
    const timer = setTimeout(() => onSearch(inputValue), searchDebounceMs)
    return () => clearTimeout(timer)
  }, [inputValue, source, filters])

  const onSourceChange = (value: SearchSource) => {
    setSource(value)
    loadFirstPage({search: searchTerm, source: value, ...filters})
  }

  const onFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
    loadFirstPage({search: searchTerm, source, ...newFilters})
  }

  const hasFilters = filters.type !== null || filters.state !== null || filters.status !== null

  const sourceLabel = sources.find((s) => s.value === source)?.label
  const batchOffset = (currentPage - pageStart) * perPage
  const rows = data.samEntities?.nodes.slice(batchOffset, batchOffset + perPage) ?? []

  return (
    <div>
      <div className='toolbar'>
        <label className='field field-grow'>
          <span className='field-label'>Search</span>
          <div className='search-box'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
              <circle cx='11' cy='11' r='7'/><path d='m20 20-3.5-3.5'/>
            </svg>
            <input placeholder='Name, UEI, city, cage code, id...' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
          </div>
        </label>
        <div className='field'>
          <span className='field-label'>Database</span>
          <div className='segmented' role='group' aria-label='Database'>
            {sources.map((s) => (
              <button key={s.value} type='button' className={source === s.value ? 'active' : undefined} aria-pressed={source === s.value} onClick={() => source !== s.value && onSourceChange(s.value)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div className='field'>
          <span className='field-label'>Type</span>
          <div className='segmented' role='group' aria-label='Type'>
            {entityTypes.map((t) => (
              <button key={t.label} type='button' className={filters.type === t.value ? 'active' : undefined} aria-pressed={filters.type === t.value} onClick={() => filters.type !== t.value && onFiltersChange({...filters, type: t.value})}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <label className='field'>
          <span className='field-label'>State</span>
          <select className='select' value={filters.state ?? ''} onChange={(e) => onFiltersChange({...filters, state: e.target.value ? e.target.value as UsState : null})}>
            <option value=''>All states</option>
            {usStates.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
          </select>
        </label>
        <label className='field'>
          <span className='field-label'>Status</span>
          <select className='select' value={filters.status ?? ''} onChange={(e) => onFiltersChange({...filters, status: e.target.value ? e.target.value as RegistrationStatus : null})}>
            <option value=''>All statuses</option>
            {statuses.map((st) => <option key={st.value} value={st.value}>{st.label}</option>)}
          </select>
        </label>
        {hasFilters &&
          <button type='button' className='clear-filters' onClick={() => onFiltersChange(noFilters)}>Clear filters</button>
        }
      </div>

      {data.samEntities && (
        <div className={`results ${isPending ? 'loading' : ''}`} aria-busy={isPending}>
          <div className='results-summary'>
            <span>
              <strong>{totalSearch.toLocaleString()}</strong> results of {totalCount.toLocaleString()} records
            </span>
            <span className='source-tag'>{sourceLabel}</span>
          </div>
          <div className='table-wrap'>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>UEI</th>
                  <th>Type</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Status</th>
                  <th>Cage Code</th>
                  <th>Id</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 &&
                  <tr><td colSpan={8} className='empty'>No results match your search</td></tr>
                }
                {rows.map((entity) => {
                  return (
                    <tr key={entity.id}>
                      <td className='cell-name'>{entity.name}</td>
                      <td className='cell-mono'>{entity.uei}</td>
                      <td>
                        {entity.type &&
                          <span className={`badge ${entity.type === 'Person' ? 'badge-person' : 'badge-company'}`}>{entity.type}</span>
                        }
                      </td>
                      <td>{entity.city}</td>
                      <td>{entity.state}</td>
                      <td>
                        {entity.status &&
                          <span className={`status status-${entity.status.toLowerCase()}`}>{entity.status}</span>
                        }
                      </td>
                      <td className='cell-mono'>{entity.cageCode}</td>
                      <td className='cell-mono'>{entity.id}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 &&
            <nav className='pager' aria-label='Pagination'>
              {currentPage > 1 && <button type='button' aria-label='Previous page' onClick={goBackwards}>{"\u2190"}</button>}
              {pages.map((num) => {
                const nextBatch = num >= pageStart + pagesPerQuery
                return (
                  <button key={num.toString()} type='button' className={num == currentPage ? 'active' : undefined} aria-current={num == currentPage ? 'page' : undefined} onClick={() => goToPage(num)}>
                    {nextBatch ? `${num}\u2026` : num}
                  </button>
                )
              })}
            </nav>
          }
        </div>
      )}
    </div>
  )
}
