/**
 * Calculate trip status based on start and end dates
 */
export function getTripStatus(startDate, endDate) {
  if (!startDate || !endDate) return 'Upcoming'

  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Upcoming'
  }

  if (now < start) return 'Upcoming'
  if (now >= start && now <= end) return 'Ongoing'
  return 'Completed'
}

/**
 * Calculate days until trip starts
 */
export function daysUntilTrip(startDate) {
  if (!startDate) return null
  const start = new Date(`${startDate}T00:00:00`)
  if (isNaN(start.getTime())) return null

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24))
  return diff
}

/**
 * Calculate trip duration in days
 */
export function calculateTripDuration(startDate, endDate) {
  if (!startDate || !endDate) return 0
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0

  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  return Math.max(1, diff)
}

/**
 * Format date for display
 */
export function formatTripDate(dateString) {
  if (!dateString) return 'Not set'
  const date = new Date(`${dateString}T00:00:00`)
  if (isNaN(date.getTime())) return dateString

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Generate booking reference number
 */
export function generateBookingRef(destinationId) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let ref = 'STH' // SmartTravelHub prefix
  for (let i = 0; i < 6; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return ref
}

/**
 * Get status badge color
 */
export function getStatusBadgeColor(status) {
  const colors = {
    Upcoming: '#3b82f6',
    Ongoing: '#10b981',
    Completed: '#6b7280',
  }
  return colors[status] || '#9ca3af'
}

/**
 * Calculate days remaining in ongoing trip
 */
export function daysRemainingInTrip(endDate) {
  if (!endDate) return null
  const end = new Date(`${endDate}T00:00:00`)
  if (isNaN(end.getTime())) return null

  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  return diff
}
