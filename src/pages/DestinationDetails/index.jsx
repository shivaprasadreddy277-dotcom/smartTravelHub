import { useEffect, useState } from 'react'
import { destinations } from '../../data/destinations'
import './index.css'

const FALLBACK_IMAGE_URL = new URL('../../assets/images/destinations/fallback.jpg', import.meta.url).href

function DestinationDetails({ selectedDestinationId, onExplore }) {
  const [viewMode, setViewMode] = useState('overview')
  const [insight, setInsight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const destination =
    destinations.find((item) => item.id === selectedDestinationId) || destinations[0]

  const galleryImages = [
    destination.image,
    ...(destination.gallery ?? [destination.image, destination.image, destination.image]),
  ].slice(0, 4)
  const famousForText = Array.isArray(destination.famousFor)
    ? destination.famousFor.join(', ')
    : destination.famousFor

  useEffect(() => {
    let active = true

    async function loadInsights() {
      setLoading(true)
      setError('')
      setInsight(null)

      try {
        const response = await fetch('/destinationInsights.json')
        if (!response.ok) {
          throw new Error('Unable to load destination insights.')
        }

        const data = await response.json()
        const destinationInsight = data.find((item) => item.id === destination.id)

        if (!destinationInsight) {
          throw new Error('Smart insight not available for this destination yet.')
        }

        if (active) {
          setInsight(destinationInsight)
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError.message || 'Insight service failed.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadInsights()

    return () => {
      active = false
    }
  }, [destination.id])

  return (
    <div className="details-page">
      <div className="details-header">
        <div className="details-header-top">
          <p className="details-label">Smart Destination Insight</p>
          <button
            type="button"
            className="details-back-button"
            onClick={() => onExplore && onExplore('home')}
          >
            Back to destinations
          </button>
        </div>
        <h2>{destination.name}</h2>
        <p className="details-subtitle">
          Practical travel guidance for better planning, comfort, and safety.
        </p>
      </div>

      <div className="details-hero">
        <img
          className="details-hero-image"
          src={destination.image}
          alt={`${destination.name} main view`}
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE_URL
          }}
        />
        <div className="details-hero-banner">
          <p>{destination.category}</p>
          <h3>{famousForText}</h3>
        </div>
      </div>

      <section className="details-gallery-grid">
        {galleryImages.slice(1).map((image, index) => (
          <img
            key={`${destination.id}-gallery-${index}`}
            src={image}
            alt={`${destination.name} gallery ${index + 1}`}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE_URL
            }}
          />
        ))}
      </section>

      <div className="details-navigation">
        <button
          type="button"
          className={viewMode === 'overview' ? 'active' : ''}
          onClick={() => setViewMode('overview')}
        >
          Overview
        </button>
        <button
          type="button"
          className={viewMode === 'tips' ? 'active' : ''}
          onClick={() => setViewMode('tips')}
        >
          Travel Tips
        </button>
      </div>

      <div className="details-content">
        {viewMode === 'overview' ? (
          <div className="details-summary">
            <h3>{famousForText}</h3>
            <p>{destination.description}</p>
          </div>
        ) : (
          <div className="details-summary">
            <h3>Plan with confidence</h3>
            <p>{destination.travelTip}</p>
          </div>
        )}

        <div className="details-facts-grid">
          <div className="fact-item">
            <span>Best month</span>
            <strong>{destination.bestMonth}</strong>
          </div>
          <div className="fact-item">
            <span>Crowd level</span>
            <strong>{destination.crowdLevel}</strong>
          </div>
          <div className="fact-item">
            <span>Climate</span>
            <strong>{destination.climate}</strong>
          </div>
          <div className="fact-item">
            <span>Safety</span>
            <strong>{destination.safety}</strong>
          </div>
          <div className="fact-item">
            <span>Duration</span>
            <strong>{destination.duration}</strong>
          </div>
        </div>

        <div className="details-subsection">
          <h4>Top attractions</h4>
          <ul className="attraction-list">
            {destination.attractions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="details-accommodation">
          <h4>Accommodation suggestions</h4>
          <div className="accommodation-grid">
            {destination.accommodation.map((option) => (
              <article key={option.type} className="accommodation-card">
                <h5>{option.type}</h5>
                <p>{option.cost}</p>
                <small>{option.example}</small>
              </article>
            ))}
          </div>
        </div>

        <div className="details-packing">
          <h4>Packing checklist</h4>
          <ul className="packing-list">
            {destination.packing.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="insight-panel">
        <div className="insight-panel-header">
          <h3>Destination advisory</h3>
          <p>Insights based on destination conditions, comfort, and smart travel choices.</p>
        </div>

        {loading ? (
          <p className="details-loading">Loading smart insights...</p>
        ) : error ? (
          <p className="details-error">{error}</p>
        ) : (
          <div className="insight-grid">
            <div className="insight-card">
              <span>Crowd Level</span>
              <strong>{insight.crowdLevel}</strong>
            </div>
            <div className="insight-card">
              <span>Travel Difficulty</span>
              <strong>{insight.travelDifficulty}</strong>
            </div>
            <div className="insight-card">
              <span>Climate Comfort</span>
              <strong>{insight.climateComfort}</strong>
            </div>
            <div className="insight-card">
              <span>Budget Category</span>
              <strong>{insight.budgetCategory}</strong>
            </div>
            <div className="insight-card">
              <span>Best Time</span>
              <strong>{insight.bestTime}</strong>
            </div>
          </div>
        )}

        {!loading && !error && insight && (
          <div className="insight-guidance">
            <div className="insight-guidance-card">
              <h4>Safety guidance</h4>
              <p>{insight.safetyNote}</p>
            </div>
            <div className="insight-guidance-card highlighted">
              <h4>Travel suggestion</h4>
              <p>{insight.travelSuggestion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DestinationDetails
