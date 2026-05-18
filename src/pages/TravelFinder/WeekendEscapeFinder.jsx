import DestinationCard from '../../components/DestinationCard'

function WeekendEscapeFinder({ options, selectedWeekend, onSelectWeekend, matches, onExplore }) {
  return (
    <section className="finder-section">
      <div className="section-header">
        <h2>Weekend Escape Finder</h2>
        <p>Quick suggestions for short trips, student-friendly plans, and calm escapes.</p>
      </div>
      <div className="option-list">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`option-button ${selectedWeekend === option.id ? 'active' : ''}`}
            onClick={() => onSelectWeekend(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="destination-list">
        {matches.map((item) => (
          <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
        ))}
        {matches.length === 0 && (
          <p className="empty-state">No weekend escapes fit this filter. Try another option.</p>
        )}
      </div>
    </section>
  )
}

export default WeekendEscapeFinder
