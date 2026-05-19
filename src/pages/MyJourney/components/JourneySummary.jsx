function JourneySummary({ upcomingCount, ongoingCount, completedCount }) {
  return (
    <section className="journey-summary">
      <div className="journey-group-card">
        <h3>Upcoming trips</h3>
        <p>{upcomingCount} trip{upcomingCount === 1 ? '' : 's'} recorded</p>
      </div>
      <div className="journey-group-card">
        <h3>Ongoing trips</h3>
        <p>{ongoingCount} trip{ongoingCount === 1 ? '' : 's'} recorded</p>
      </div>
      <div className="journey-group-card">
        <h3>Completed trips</h3>
        <p>{completedCount} trip{completedCount === 1 ? '' : 's'} recorded</p>
      </div>
    </section>
  )
}

export default JourneySummary
