import { useState } from 'react'
import DestinationCard from '../../components/DestinationCard'
import { destinations } from '../../data/destinations'
import './index.css'

const searchFilters = [
  { id: 'all', label: 'All Fields' },
  { id: 'name', label: 'Destination Name' },
  { id: 'category', label: 'Category' },
  { id: 'tag', label: 'Travel Tag' },
]

function SearchDestinations({ onExplore }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchField, setSearchField] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchResults = normalizedSearch
    ? destinations.filter((destination) => {
        const name = destination.name.toLowerCase()
        const category = destination.category.toLowerCase()
        const tags = destination.tags.map((tag) => tag.toLowerCase()).join(' ')

        if (searchField === 'name') {
          return name.includes(normalizedSearch)
        }
        if (searchField === 'category') {
          return category.includes(normalizedSearch)
        }
        if (searchField === 'tag') {
          return tags.includes(normalizedSearch)
        }

        return (
          name.includes(normalizedSearch) ||
          category.includes(normalizedSearch) ||
          tags.includes(normalizedSearch)
        )
      })
    : []

  return (
    <div className="search-destinations-page">
      <div className="search-header">
        <h1>Search Destinations</h1>
        <p>Find the perfect destination by name, category, or travel experience.</p>
      </div>

      <section className="search-section">
        <div className="search-panel">
          <div className="search-field">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search Goa, Adventure, Spiritual, Family Trip..."
              autoFocus
            />
          </div>
          {searchQuery && (
            <div className="search-dropdown">
              <button
                type="button"
                className="dropdown-button"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                {searchFilters.find((filter) => filter.id === searchField)?.label || 'All Fields'}
                <span className="dropdown-icon">▾</span>
              </button>
              {isFilterOpen && (
                <div className="dropdown-menu">
                  {searchFilters.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      className={`dropdown-item ${searchField === filter.id ? 'active' : ''}`}
                      onClick={() => {
                        setSearchField(filter.id)
                        setIsFilterOpen(false)
                      }}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {searchQuery && (
            <p className="search-summary">
              {searchResults.length} destination{searchResults.length === 1 ? '' : 's'} found
            </p>
          )}
        </div>

        {searchQuery ? (
          <div className="search-results">
            {searchResults.length > 0 ? (
              <div className="destination-list">
                {searchResults.map((item) => (
                  <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
                ))}
              </div>
            ) : (
              <p className="empty-state">No destinations match your search. Try a different query or filter.</p>
            )}
          </div>
        ) : (
          <div className="search-placeholder">
            <p>Start typing to search destinations...</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default SearchDestinations
