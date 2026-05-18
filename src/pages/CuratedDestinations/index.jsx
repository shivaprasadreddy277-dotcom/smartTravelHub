import { useState } from 'react'
import DestinationCard from '../../components/DestinationCard'
import { destinations } from '../../data/destinations'
import './index.css'

function CuratedDestinations({ onExplore }) {
  const [activeTab, setActiveTab] = useState('trending')

  const trendingDestinations = destinations.filter((item) =>
    item.tags.some((tag) => ['Premium', 'Family Trip', 'Weekend Trip'].includes(tag)),
  )

  const hiddenGems = destinations.filter((item) =>
    item.tags.some((tag) => ['Peaceful', 'Nature Escape', 'Relaxing'].includes(tag)),
  )

  return (
    <div className="curated-destinations-page">
      <div className="curated-header">
        <h1>Curated Destination Collections</h1>
        <p>Handpicked travel experiences for every kind of explorer.</p>
      </div>

      <div className="curated-tabs">
        <button
          type="button"
          className={`curated-tab ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          Trending Destinations
        </button>
        <button
          type="button"
          className={`curated-tab ${activeTab === 'hidden' ? 'active' : ''}`}
          onClick={() => setActiveTab('hidden')}
        >
          Hidden Gems
        </button>
      </div>

      {activeTab === 'trending' && (
        <section className="curated-section">
          <div className="section-header">
            <h2>Trending Destinations</h2>
            <p>Popular destinations for easy planning and memorable stays.</p>
          </div>
          <div className="destination-list">
            {trendingDestinations.map((item) => (
              <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
            ))}
            {trendingDestinations.length === 0 && (
              <p className="empty-state">No trending destinations found right now.</p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'hidden' && (
        <section className="curated-section">
          <div className="section-header">
            <h2>Hidden Gems</h2>
            <p>Less crowded places with calm nature and thoughtful local experiences.</p>
          </div>
          <div className="destination-list">
            {hiddenGems.map((item) => (
              <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
            ))}
            {hiddenGems.length === 0 && (
              <p className="empty-state">No hidden gems found right now.</p>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default CuratedDestinations
