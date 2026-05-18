import './index.css'

function Navbar({ activePage, onNavigate, user, onLogout }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Search' },
    { id: 'travelfinder', label: 'Travel Finder' },
    { id: 'collections', label: 'Collections' },
    { id: 'planner', label: 'Planner' },
    { id: 'myjourney', label: 'My Journey' },
  ]

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">🌴</div>
        <div>
          <span className="navbar-logo">SmartTravelHub</span>
          <span className="navbar-tagline">Smart Indian tourism assistant</span>
        </div>
      </div>

      <nav className="navbar-links">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-button ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="navbar-profile">
        {user ? (
          <>
            <span className="navbar-welcome">Welcome, {user.username}</span>
            <button type="button" className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <button type="button" className="login-button" onClick={() => onNavigate('login')}>
            Login
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
