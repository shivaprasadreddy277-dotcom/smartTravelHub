import { useState } from 'react'
import HeroSection from '../../components/HeroSection'
import DestinationCard from '../../components/DestinationCard'
import { destinations } from '../../data/destinations'
import './index.css'

const bannerOne = 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80'
const bannerTwo = 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80'
const bannerThree = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'

const travelStyles = [
  { id: 'nature', label: 'Nature Lover' },
  { id: 'peaceful', label: 'Peaceful Traveler' },
  { id: 'budget', label: 'Budget Traveler' },
  { id: 'family', label: 'Family Traveler' },
  { id: 'spiritual', label: 'Spiritual Traveler' },
  { id: 'adventure', label: 'Adventure Traveler' },
]

const weekendOptions = [
  { id: 'twoDay', label: '2-Day Trips' },
  { id: 'threeDay', label: '3-Day Trips' },
  { id: 'budgetWeekend', label: 'Budget Weekend' },
  { id: 'peaceful', label: 'Peaceful Escapes' },
]

function Home({ onExplore }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('nature')
  const [selectedWeekend, setSelectedWeekend] = useState('twoDay')

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const searchResults = normalizedSearch
    ? destinations.filter((destination) => {
        const name = destination.name.toLowerCase()
        const category = destination.category.toLowerCase()
        const tags = destination.tags.map((tag) => tag.toLowerCase()).join(' ')
        return (
          name.includes(normalizedSearch) ||
          category.includes(normalizedSearch) ||
          tags.includes(normalizedSearch)
        )
      })
    : []

  const styleMatches = destinations.filter((destination) => {
    if (selectedStyle === 'nature') {
      return (
        destination.tags.includes('Nature Escape') ||
        destination.category.includes('Hill') ||
        destination.category.includes('Mountain') ||
        destination.category.includes('River')
      )
    }
    if (selectedStyle === 'peaceful') {
      return destination.tags.includes('Peaceful') || destination.tags.includes('Relaxing')
    }
    if (selectedStyle === 'budget') {
      return (
        destination.budget === 'Budget Friendly' ||
        destination.tags.includes('Budget Friendly') ||
        destination.tags.includes('Student Friendly')
      )
    }
    if (selectedStyle === 'family') {
      return destination.tags.includes('Family Trip') || destination.tags.includes('Budget Friendly')
    }
    if (selectedStyle === 'spiritual') {
      return destination.category === 'Pilgrimage' || destination.tags.includes('Peaceful')
    }
    if (selectedStyle === 'adventure') {
      return destination.tags.includes('Adventure') || destination.category.includes('Adventure')
    }
    return false
  })

  const weekendMatches = destinations.filter((destination) => {
    if (selectedWeekend === 'twoDay') {
      return destination.duration.includes('2–3')
    }
    if (selectedWeekend === 'threeDay') {
      return (
        destination.duration.includes('3–4') ||
        destination.duration.includes('3–5') ||
        destination.duration.includes('4–6')
      )
    }
    if (selectedWeekend === 'budgetWeekend') {
      return (
        destination.budget === 'Budget Friendly' ||
        destination.tags.includes('Budget Friendly') ||
        destination.tags.includes('Low Budget')
      )
    }
    if (selectedWeekend === 'peaceful') {
      return destination.tags.includes('Peaceful') || destination.tags.includes('Relaxing')
    }
    return false
  })

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

  return (
    <div className="home-page">
      <HeroSection onExplore={onExplore} />

      <section className="home-section home-search-section">
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
            <p className="search-summary">
              {searchResults.length} destination{searchResults.length === 1 ? '' : 's'} found
            </p>
          )}
        </div>
        <div className="home-visuals">
          <img src={bannerOne} alt="Travel guide illustration" />
          <img src={bannerTwo} alt="Smart travel planning illustration" />
          <img src={bannerThree} alt="Trip inspiration illustration" />
        </div>
        {searchQuery && (
          <div className="destination-list search-results">
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
              ))
            ) : (
              <p className="empty-state">No destinations match your search yet. Try a different travel idea.</p>
            )}
          </div>
        )}
      </section>

      <section className="home-section home-style-matcher">
        <div className="section-header">
          <h2>Find Your Travel Style</h2>
          <p>Select a travel style and see destination matches instantly.</p>
        </div>
        <div className="option-list">
          {travelStyles.map((style) => (
            <button
              key={style.id}
              type="button"
              className={`option-button ${selectedStyle === style.id ? 'active' : ''}`}
              onClick={() => setSelectedStyle(style.id)}
            >
              {style.label}
            </button>
          ))}
        </div>
        <div className="destination-list">
          {styleMatches.map((item) => (
            <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
          ))}
          {styleMatches.length === 0 && (
            <p className="empty-state">No matching destinations found for this style yet.</p>
          )}
        </div>
      </section>

      <section className="home-section home-weekend-finder">
        <div className="section-header">
          <h2>Weekend Escape Finder</h2>
          <p>Quick suggestions for short trips, student-friendly plans, and calm escapes.</p>
        </div>
        <div className="option-list">
          {weekendOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`option-button ${selectedWeekend === option.id ? 'active' : ''}`}
              onClick={() => setSelectedWeekend(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="destination-list">
          {weekendMatches.map((item) => (
            <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
          ))}
          {weekendMatches.length === 0 && (
            <p className="empty-state">No weekend escapes fit this filter. Try another option.</p>
          )}
        </div>
      </section>

      <section className="home-section home-destinations">
        <div className="home-headline">
          <h2>Beginner Friendly Trips</h2>
          <p>Safe, easy, and affordable options for first-time travelers.</p>
        </div>
        <div className="destination-list">
          {beginnerFriendlyTrips.slice(0, 4).map((item) => (
            <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
          ))}
          {beginnerFriendlyTrips.length === 0 && (
            <p className="empty-state">No beginner friendly trips found right now.</p>
          )}
        </div>
      </section>

      <section className="home-section home-destinations">
        <div className="home-headline">
          <h2>Peaceful Escapes</h2>
          <p>Relaxing low-crowd destinations for calm nature and restful travel.</p>
        </div>
        <div className="destination-list">
          {peacefulEscapes.slice(0, 4).map((item) => (
            <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
          ))}
          {peacefulEscapes.length === 0 && (
            <p className="empty-state">No peaceful escapes found right now.</p>
          )}
        </div>
      </section>

      <section className="home-section travel-responsible">
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

      <section className="home-section home-destinations">
        <div className="home-headline">
          <h2>Trending Destinations</h2>
          <p>Popular destinations for easy planning and memorable stays.</p>
        </div>
        <div className="destination-list">
          {trendingDestinations.slice(0, 4).map((item) => (
            <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
          ))}
        </div>
      </section>

      <section className="home-section home-destinations">
        <div className="home-headline">
          <h2>Hidden Gems</h2>
          <p>Less crowded places with calm nature and thoughtful local experiences.</p>
        </div>
        <div className="destination-list">
          {hiddenGems.slice(0, 4).map((item) => (
            <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
