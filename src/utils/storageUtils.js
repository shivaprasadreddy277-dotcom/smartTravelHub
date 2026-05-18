/**
 * Get user-specific storage key
 */
export function getUserStorageKey(baseKey, userId) {
  if (!userId) return baseKey // Fallback for non-authenticated
  return `${baseKey}__${userId}`
}

/**
 * Get item from user-specific localStorage
 */
export function getUserLocalStorage(baseKey, userId) {
  const key = getUserStorageKey(baseKey, userId)
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : null
}

/**
 * Set item in user-specific localStorage
 */
export function setUserLocalStorage(baseKey, userId, value) {
  const key = getUserStorageKey(baseKey, userId)
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Clear all user-specific storage for a given userId
 */
export function clearUserStorage(userId) {
  const keysToRemove = [
    'smartTravelHubTrips',
    'smartTravelHubReviews',
    'plannerDestination',
    'plannerGroupSize',
    'plannerDuration',
    'plannerTransport',
    'plannerAccommodation',
    'plannerFoodBudget',
    'plannerActivityBudget',
  ]

  keysToRemove.forEach((baseKey) => {
    const key = getUserStorageKey(baseKey, userId)
    localStorage.removeItem(key)
  })
}
