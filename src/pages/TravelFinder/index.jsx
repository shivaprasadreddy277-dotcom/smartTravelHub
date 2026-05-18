import { useState } from 'react'
import { destinations } from '../../data/destinations'
import FinderTabs from './FinderTabs'
import TravelStyleFinder from './TravelStyleFinder'
import WeekendEscapeFinder from './WeekendEscapeFinder'
import { travelStyles, weekendOptions } from './travelFinderData'
import { getStyleMatches, getWeekendMatches } from './travelFinderFilters'
import './index.css'

function TravelFinder({ onExplore }) {
  const [selectedStyle, setSelectedStyle] = useState('nature')
  const [selectedWeekend, setSelectedWeekend] = useState('twoDay')
  const [activeTab, setActiveTab] = useState('style')

  const styleMatches = getStyleMatches(destinations, selectedStyle)
  const weekendMatches = getWeekendMatches(destinations, selectedWeekend)

  return (
    <div className="travel-finder-page">
      <div className="finder-header">
        <h1>Find Your Perfect Travel Match</h1>
        <p>Explore destinations tailored to your travel style and schedule.</p>
      </div>

      <FinderTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {activeTab === 'style' && (
        <TravelStyleFinder
          styles={travelStyles}
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
          matches={styleMatches}
          onExplore={onExplore}
        />
      )}

      {activeTab === 'weekend' && (
        <WeekendEscapeFinder
          options={weekendOptions}
          selectedWeekend={selectedWeekend}
          onSelectWeekend={setSelectedWeekend}
          matches={weekendMatches}
          onExplore={onExplore}
        />
      )}
    </div>
  )
}

export default TravelFinder
