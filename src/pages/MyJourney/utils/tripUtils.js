export const getStatusFromDate = (dateString) => {
  if (!dateString) return 'Upcoming'
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return 'Upcoming'
  const now = new Date()
  return date > now ? 'Upcoming' : 'Completed'
}

export const daysUntil = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  const now = new Date()
  const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24))
  return diff
}
