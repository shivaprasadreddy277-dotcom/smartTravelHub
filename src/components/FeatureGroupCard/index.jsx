import './index.css'

function FeatureGroupCard({ title, description, items, onExplore }) {
  return (
    <article className="feature-group-card">
      <div className="feature-card-header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="feature-card-items">
        {items.slice(0, 3).map((item) => (
          <button
            key={item.id}
            type="button"
            className="feature-card-item"
            onClick={() => onExplore && onExplore('destinationdetails', item.id)}
          >
            <div>
              <strong>{item.name}</strong>
              <span>{item.category}</span>
            </div>
            <span className="pill">{item.budget}</span>
          </button>
        ))}
      </div>
      <div className="feature-card-footer">
        <p>{items.length} destinations in this group</p>
      </div>
    </article>
  )
}

export default FeatureGroupCard
