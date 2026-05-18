import { useState } from 'react'
import HeroSection from '../../components/HeroSection'
import DestinationCard from '../../components/DestinationCard'
import FeatureGroupCard from '../../components/FeatureGroupCard'
import { destinations } from '../../data/destinations'
import './index.css'

const searchFilters = [
  { id: 'all', label: 'All Fields' },
  { id: 'name', label: 'Destination Name' },
  { id: 'category', label: 'Category' },
  { id: 'tag', label: 'Travel Tag' },
]

function Home({ onExplore }) {
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

  const trendingDestinations = destinations.filter((item) =>
    item.tags.some((tag) => ['Premium', 'Family Trip', 'Weekend Trip'].includes(tag)),
  )
  const hiddenGems = destinations.filter((item) =>
    item.tags.some((tag) => ['Peaceful', 'Nature Escape', 'Relaxing'].includes(tag)),
  )

  const beginnerFriendlyTrips = destinations.filter((destination) =>
    destination.tags.some((tag) =>
      ['Beginner Friendly', 'Safe Destination', 'Easy Travel', 'Budget Friendly', 'Family Trip'].includes(tag),
    ),
  )

  const peacefulEscapes = destinations.filter((destination) =>
    destination.tags.some((tag) =>
      ['Relaxing', 'Calm Trip', 'Nature Escape', 'Low Crowd'].includes(tag),
    ),
  )

  const featuredGroups = [
    {
      id: 'beginner',
      title: 'Beginner Friendly Trips',
      description: 'Safe, easy, and affordable options for first-time travelers.',
      items: beginnerFriendlyTrips,
    },
    {
      id: 'peaceful',
      title: 'Peaceful Escapes',
      description: 'Relaxing low-crowd destinations for calm nature and restful travel.',
      items: peacefulEscapes,
    },
    {
      id: 'trending',
      title: 'Trending Destinations',
      description: 'Popular destinations for easy planning and memorable stays.',
      items: trendingDestinations,
    },
    {
      id: 'hidden',
      title: 'Hidden Gems',
      description: 'Less crowded places with calm nature and thoughtful local experiences.',
      items: hiddenGems,
    },
  ]

  const featuredDestinationIds = new Set(
    featuredGroups.flatMap((group) => group.items.map((item) => item.id)),
  )

  const allDestinations = destinations

  const pageSections = [
    { id: 'all-destinations', label: 'All Destinations' },
    { id: 'search-destinations', label: 'Search' },
    { id: 'featured-collections', label: 'Featured Collections' },
    { id: 'travel-responsible', label: 'Travel Responsibly' },
  ]

  return (
    <div className="home-page">
      <HeroSection onExplore={onExplore} />

      <section className="destination-nav-bar">
        <div className="destination-nav-label">Jump to</div>
        <div className="destination-nav-links">
          {pageSections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="destination-nav-link">
              {section.label}
            </a>
          ))}
        </div>
      </section>

      <section className="home-section home-destinations" id="all-destinations">
        <div className="home-headline">
          <h2>All Destinations</h2>
          <p>Browse every destination available in one full list of travel ideas.</p>
        </div>
        <div className="destination-list">
          {allDestinations.map((item) => (
            <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
          ))}
        </div>
      </section>

      <section className="home-section home-search-section" id="search-destinations">
        <div className="search-panel">
          <div>
            <h2>Search smart tourism destinations</h2>
            <p>Find Indian travel ideas by name, category, or travel vibe instantly.</p>
          </div>
          <div className="search-field">
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search Goa, Adventure, Spiritual, Family Trip..."
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
        {searchQuery && (
          <div className="search-results-list">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <article key={item.id} className="search-result-card">
                  <div className="search-result-header">
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.category}</p>
                    </div>
                    <span className="budget-pill">{item.budget}</span>
                  </div>
                  <div className="search-result-meta">
                    <span>Best Time: {item.bestMonth}</span>
                    <span>{item.duration}</span>
                  </div>
                  <p className="destination-description">{item.description}</p>
                  <div className="destination-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="destination-button"
                    onClick={() => onExplore && onExplore('destinationdetails', item.id)}
                  >
                    Explore
                  </button>
                </article>
              ))
            ) : (
              <p className="empty-state">No destinations match your search yet. Try a different travel idea.</p>
            )}
          </div>
        )}
      </section>

      <section className="home-section home-featured-groups" id="featured-collections">
        <div className="section-header">
          <h2>Featured travel collections</h2>
          <p>Explore our curated destination groups with quick previews for every traveler.</p>
        </div>
        <div className="featured-groups-grid">
          {featuredGroups.map((group) => (
            <FeatureGroupCard
              key={group.id}
              title={group.title}
              description={group.description}
              items={group.items}
              onExplore={onExplore}
            />
          ))}
        </div>
      </section>

      <section className="home-section travel-responsible" id="travel-responsible">
        <div className="home-headline">
          <h2>Travel Responsibly</h2>
          <p>Explore with care: protect nature, support local guides, and reduce plastic waste.</p>
        </div>
        <div className="responsible-grid">
          <div className="responsible-card">
            <h4>Eco tourism</h4>
            <p>Choose destinations that preserve natural beauty and honor local communities.</p>
          </div>
          <div className="responsible-card">
            <h4>Protect nature</h4>
            <p>Avoid litter, stick to marked trails, and respect wildlife habitats.</p>
          </div>
          <div className="responsible-card">
            <h4>Support locals</h4>
            <p>Pick local stays, authentic food spots, and community-led experiences.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
