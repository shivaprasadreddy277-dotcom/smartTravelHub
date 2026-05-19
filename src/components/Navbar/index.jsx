import './index.css'

function Navbar({ activePage, onNavigate, user, onLogout }) {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'travelfinder', label: 'Travel Finder' },
    { id: 'collections', label: 'Collections' },
    { id: 'planner', label: 'Planner' },
    { id: 'myjourney', label: 'My Journey' },
    { id: 'search', label: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> },
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
              Sign Out
            </button>
          </>
        ) : (
          <button type="button" className="login-button" onClick={() => onNavigate('login')}>
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
