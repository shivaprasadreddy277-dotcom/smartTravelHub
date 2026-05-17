import './index.css'

function HeroSection({ onExplore }) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="hero-label">Travel planning made easy</p>
        <h1>SmartTravelHub helps you explore the world with confidence.</h1>
        <p>
          Build your next journey with clear planning, beautiful destinations,
          and thoughtful travel notes.
        </p>
        <button type="button" className="hero-cta" onClick={() => onExplore('planner')}>
          Explore planner
        </button>
      </div>
      <div className="hero-card">
        <div className="hero-card-top">Featured route</div>
        <div className="hero-card-info">
          <strong>Coastal adventure</strong>
          <span>3 days · ideal for first-time travelers</span>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
