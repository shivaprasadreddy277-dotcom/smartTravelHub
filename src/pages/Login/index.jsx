import { useState } from 'react'
import './index.css'

function Login({ user, onLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!username.trim() || !email.trim() || !password) {
      setMessage('Please provide username, email, and password.')
      return
    }

    const loginData = {
      username: username.trim(),
      email: email.trim(),
    }

    onLogin(loginData)
    setMessage(`Welcome, ${username.trim()}! You are ready to plan smarter trips.`)
    setUsername('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="login-page">
      <div className="login-panel">
        <p className="login-label">Member access</p>
        <h2>Sign in to save your journey plans.</h2>

        {user ? (
          <div className="login-success">
            <p>Welcome back, {user.username}. Your travel assistant is ready.</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Your name"
                required
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter a secure password"
                required
              />
            </label>
            <button type="submit">Login</button>
            {message && <p className="login-message">{message}</p>}
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
