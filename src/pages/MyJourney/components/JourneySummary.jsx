function JourneySummary({ groupedTrips }) {
  return (
    <section className="journey-summary">
      {Object.entries(groupedTrips).map(([label, trips]) => (
        <div key={label} className="journey-group-card">
          <h3>{label} trips</h3>
          <p>{trips.length} trip{trips.length === 1 ? '' : 's'} recorded</p>
        </div>
      ))}
    </section>
  )
}

export default JourneySummary
