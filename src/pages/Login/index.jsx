import { useState, useEffect } from "react";
import "./index.css";

function Login({ user, onLogin }) {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setIsSignUp(false);
    } else {
      localStorage.setItem('hasVisitedBefore', 'true');
      setIsSignUp(true);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username.trim() || !email.trim() || !password) {
      setMessage("Please provide username, email, and password.");
      return;
    }

    const loginData = {
      username: username.trim(),
      email: email.trim(),
    };

    onLogin(loginData);

    setMessage(
      `Welcome, ${username.trim()}! Your next adventure starts now.`
    );

    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <section className="login-page">

      {/* Left Side Image Content */}
      <div className="login-banner">

        <div className="banner-overlay">

          <p className="travel-badge">
            🌍 Smart Tourism Experience
          </p>

          <h1>
            Explore India <br />
            Beyond Destinations
          </h1>

          <p className="banner-description">
            Discover peaceful escapes, weekend adventures,
            budget-friendly trips, and unforgettable travel memories
            with SmartTravelHub.
          </p>

          <div className="travel-quotes">
            <p>
              “Travel opens the door to new experiences and better memories.”
            </p>

            <p>
              “The journey becomes beautiful when the planning becomes smart.”
            </p>
          </div>

        </div>
      </div>

      {/* Right Side Login Panel */}
      <div className="login-panel">

        <p className="login-label">
          Member Access
        </p>

        <h2>
          {isSignUp ? "Create your account to start your journey" : "Sign in to continue your travel journey"}
        </h2>

        <p className="login-subtitle">
          Save trips, manage journeys, and explore India smarter.
        </p>

        {user ? (

          <div className="login-success">
            <h3>
              Welcome back, {user.username} 👋
            </h3>

            <p>
              Your SmartTravelHub travel assistant is ready.
            </p>
          </div>

        ) : (

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <label>
              Username

              <input
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Enter your username"
                required
              />
            </label>

            <label>
              Email Address

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                required
              />
            </label>

            <button type="submit">
              {isSignUp ? "Sign Up to SmartTravelHub" : "Sign In to SmartTravelHub"}
            </button>

            <p style={{ textAlign: "center", marginTop: "1rem", color: "#64748b" }}>
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: "inherit"
                }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>

            {message && (
              <p className="login-message">
                {message}
              </p>
            )}

          </form>

        )}

      </div>

    </section>
  );
}

export default Login;