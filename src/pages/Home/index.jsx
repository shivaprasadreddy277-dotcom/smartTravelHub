import { useState } from 'react'
import HeroSection from '../../components/HeroSection'
import DestinationCard from '../../components/DestinationCard'
import FeatureGroupCard from '../../components/FeatureGroupCard'
import { destinations } from '../../data/destinations'
import './index.css'

function Home({ onExplore }) {
  const trendingDestinations = destinations.filter((item) =>
    item.tags.some((tag) => ['Premium', 'Family Trip', 'Weekend Trip'].includes(tag)),
  )
  const hiddenGems = destinations.filter((item) =>
    item.tags.some((tag) => ['Peaceful', 'Nature Escape', 'Relaxing'].includes(tag)),
  )

  const beginnerFriendlyTrips = destinations.filter((destination) =>
    destination.tags.some((tag) =>
      ['Beginner Friendly', 'Safe Destination', 'Easy Travel', 'Budget Friendly', 'Family Trip'].includes(tag),
    ),
  )

  const peacefulEscapes = destinations.filter((destination) =>
    destination.tags.some((tag) =>
      ['Relaxing', 'Calm Trip', 'Nature Escape', 'Low Crowd'].includes(tag),
    ),
  )

  const featuredGroups = [
    {
      id: 'beginner',
      title: 'Beginner Friendly Trips',
      description: 'Safe, easy, and affordable options for first-time travelers.',
      items: beginnerFriendlyTrips,
    },
    {
      id: 'peaceful',
      title: 'Peaceful Escapes',
      description: 'Relaxing low-crowd destinations for calm nature and restful travel.',
      items: peacefulEscapes,
    },
    {
      id: 'trending',
      title: 'Trending Destinations',
      description: 'Popular destinations for easy planning and memorable stays.',
      items: trendingDestinations,
    },
    {
      id: 'hidden',
      title: 'Hidden Gems',
      description: 'Less crowded places with calm nature and thoughtful local experiences.',
      items: hiddenGems,
    },
  ]

  const featuredDestinationIds = new Set(
    featuredGroups.flatMap((group) => group.items.map((item) => item.id)),
  )

  const allDestinations = destinations

  const pageSections = [
    { id: 'all-destinations', label: 'All Destinations' },
    { id: 'featured-collections', label: 'Featured Collections' },
    { id: 'travel-responsible', label: 'Travel Responsibly' },
  ]

  return (
    <div className="home-page">
      <HeroSection onExplore={onExplore} />

      <section className="destination-nav-bar">
        <div className="destination-nav-label">Jump to</div>
        <div className="destination-nav-links">
          {pageSections.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="destination-nav-link">
              {section.label}
            </a>
          ))}
        </div>
      </section>

      <section className="home-section home-destinations" id="all-destinations">
        <div className="home-headline">
          <h2>All Destinations</h2>
          <p>Browse every destination available in one full list of travel ideas.</p>
        </div>
        <div className="destination-list">
          {allDestinations.map((item) => (
            <DestinationCard key={item.id} destination={item} onExplore={onExplore} />
          ))}
        </div>
      </section>

      <section className="home-section home-featured-groups" id="featured-collections">
        <div className="section-header">
          <h2>Featured travel collections</h2>
          <p>Explore our curated destination groups with quick previews for every traveler.</p>
        </div>
        <div className="featured-groups-grid">
          {featuredGroups.map((group) => (
            <FeatureGroupCard
              key={group.id}
              title={group.title}
              description={group.description}
              items={group.items}
              onExplore={onExplore}
            />
          ))}
        </div>
      </section>

      <section className="home-section travel-responsible" id="travel-responsible">
        <div className="home-headline">
          <h2>Travel Responsibly</h2>
          <p>Explore with care: protect nature, support local guides, and reduce plastic waste.</p>
        </div>
        <div className="responsible-grid">
          <div className="responsible-card">
            <h4>Eco tourism</h4>
            <p>Choose destinations that preserve natural beauty and honor local communities.</p>
          </div>
          <div className="responsible-card">
            <h4>Protect nature</h4>
            <p>Avoid litter, stick to marked trails, and respect wildlife habitats.</p>
          </div>
          <div className="responsible-card">
            <h4>Support locals</h4>
            <p>Pick local stays, authentic food spots, and community-led experiences.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
