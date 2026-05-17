import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Planner from './pages/Planner'
import MyJourney from './pages/MyJourney'
import DestinationDetails from './pages/DestinationDetails'
import Login from './pages/Login'
import './styles/app.css'

const pageMap = {
  home: Home,
  planner: Planner,
  myjourney: MyJourney,
  destinationdetails: DestinationDetails,
  login: Login,
}

function App() {
  const [activePage, setActivePage] = useState('home')
  const [selectedDestinationId, setSelectedDestinationId] = useState('')
  const [user, setUser] = useState(null)
  const ActivePage = pageMap[activePage] || Home

  useEffect(() => {
    const token = localStorage.getItem('smartTravelHubToken')
    const savedUser = localStorage.getItem('smartTravelHubUser')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        setUser(null)
      }
    }
  }, [])

  const handleLogin = (userData) => {
    localStorage.setItem('smartTravelHubToken', 'smarttravelhub-user-session')
    localStorage.setItem('smartTravelHubUser', JSON.stringify(userData))
    setUser(userData)
    setActivePage('home')
  }

  const handleLogout = () => {
    localStorage.removeItem('smartTravelHubToken')
    localStorage.removeItem('smartTravelHubUser')
    setUser(null)
    setActivePage('home')
  }

  const handleNavigate = (page) => {
    if (['planner', 'myjourney'].includes(page) && !user) {
      setActivePage('login')
      return
    }
    setActivePage(page)
  }

  const handleExplore = (page, destinationId) => {
    if (destinationId) {
      setSelectedDestinationId(destinationId)
    }
    setActivePage(page)
  }

  return (
    <div className="app-shell">
      <Navbar activePage={activePage} onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
      <main className="content-area">
        <ActivePage
          onExplore={handleExplore}
          selectedDestinationId={selectedDestinationId}
          user={user}
          onLogin={handleLogin}
        />
      </main>
      <Footer />
    </div>
  )
}

export default App
