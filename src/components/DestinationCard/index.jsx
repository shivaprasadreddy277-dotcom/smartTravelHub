import './index.css'

const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/800x500.png?text=Image+not+available'

function DestinationCard({ destination, onExplore }) {
  return (
    <article className="destination-card">
      <img
        className="destination-image"
        src={destination.image}
        alt={destination.name}
        onError={(event) => {
          event.currentTarget.src = FALLBACK_IMAGE_URL
        }}
      />
      <div className="card-header">
        <div>
          <h3>{destination.name}</h3>
          <p className="destination-category">{destination.category}</p>
        </div>
        <span className="budget-pill">{destination.budget}</span>
      </div>
      <div className="destination-meta">
        <span>Best Time: {destination.bestMonth}</span>
        <span>{destination.duration}</span>
      </div>
      <p className="destination-description">{destination.description}</p>
      <div className="destination-tags">
        {destination.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
      <button
        type="button"
        className="destination-button"
        onClick={() => onExplore && onExplore('destinationdetails', destination.id)}
      >
        Explore
      </button>
    </article>
  )
}

export default DestinationCard
