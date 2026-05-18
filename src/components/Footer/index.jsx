import "./index.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Brand Section */}
        <div className="footer-section">
          <h2 className="footer-logo">SmartTravelHub</h2>
          <p className="footer-description">
            Discover the beauty of India with smart travel planning,
            budget-friendly trips, peaceful escapes, and unforgettable
            tourism experiences.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Explore</li>
            <li>Planner</li>
            <li>My Journey</li>
            <li>Reviews</li>
          </ul>
        </div>

        {/* Destinations */}
        <div className="footer-section">
          <h3>Top Destinations</h3>
          <ul>
            <li>Goa</li>
            <li>Ooty</li>
            <li>Coorg</li>
            <li>Kerala</li>
            <li>Jaipur</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📧 info@smarttravelhub.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 India Tourism Network</p>
        </div>

      </div>

      {/* Bottom Footer */}
      <div className="footer-bottom">
        <p>© 2026 SmartTravelHub. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;