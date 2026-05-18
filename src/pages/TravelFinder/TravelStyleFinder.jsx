import DestinationCard from '../../components/DestinationCard'

function TravelStyleFinder({ styles, selectedStyle, onSelectStyle, matches, onExplore }) {
  return (
    <section className="finder-section">
      <div className="section-header">
        <h2>Find Your Travel Style</h2>
        <p>Select a travel style and see destination matches instantly.</p>
      </div>
      <div className="option-list">
        {styles.map((style) => (
          <button
            key={style.id}
            type="button"
            className={`option-button ${selectedStyle === style.id ? 'active' : ''}`}
            onClick={() => onSelectStyle(style.id)}
          >
            {style.label}
          </button>
        ))}
      </div>
      <div className="destination-list">
        {matches.map((item) => (
          <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
        ))}
        {matches.length === 0 && (
          <p className="empty-state">No matching destinations found for this style yet.</p>
        )}
      </div>
    </section>
  )
}

export default TravelStyleFinder
