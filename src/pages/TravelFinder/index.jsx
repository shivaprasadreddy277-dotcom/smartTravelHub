import { useState } from 'react'
import DestinationCard from '../../components/DestinationCard'
import { destinations } from '../../data/destinations'
import './index.css'

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

function TravelFinder({ onExplore }) {
  const [selectedStyle, setSelectedStyle] = useState('nature')
  const [selectedWeekend, setSelectedWeekend] = useState('twoDay')
  const [activeTab, setActiveTab] = useState('style')

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

  return (
    <div className="travel-finder-page">
      <div className="finder-header">
        <h1>Find Your Perfect Travel Match</h1>
        <p>Explore destinations tailored to your travel style and schedule.</p>
      </div>

      <div className="finder-tabs">
        <button
          type="button"
          className={`finder-tab ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          Travel Style Finder
        </button>
        <button
          type="button"
          className={`finder-tab ${activeTab === 'weekend' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekend')}
        >
          Weekend Escape Finder
        </button>
      </div>

      {activeTab === 'style' && (
        <section className="finder-section">
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
      )}

      {activeTab === 'weekend' && (
        <section className="finder-section">
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
      )}
    </div>
  )
}

export default TravelFinder
