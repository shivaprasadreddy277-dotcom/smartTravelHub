function ReminderAlert({ reminder }) {
  return (
    <section className="journey-alert">
      <strong>🌍 Upcoming Trip Alert</strong>
      <p>
        Your {reminder.trip.destination} trip starts in {reminder.trip.daysUntil} days.
        {reminder.destination?.packing?.length > 0 && 
          ` Suggested: ${reminder.destination.packing.slice(0, 2).join(', ')}.`}
      </p>
    </section>
  )
}

export default ReminderAlert
