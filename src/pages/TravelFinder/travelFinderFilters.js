export function getStyleMatches(destinations, selectedStyle) {
  return destinations.filter((destination) => {
    if (selectedStyle === 'nature') {
      return (
        destination.tags.includes('Nature Escape') ||
        destination.category.includes('Hill') ||
        destination.category.includes('Mountain') ||
        destination.category.includes('River')
      )
    }
    if (selectedStyle === 'peaceful') {
      return destination.tags.includes('Peaceful') || destination.tags.includes('Relaxing')
    }
    if (selectedStyle === 'budget') {
      return (
        destination.budget === 'Budget Friendly' ||
        destination.tags.includes('Budget Friendly') ||
        destination.tags.includes('Student Friendly')
      )
    }
    if (selectedStyle === 'family') {
      return destination.tags.includes('Family Trip') || destination.tags.includes('Budget Friendly')
    }
    if (selectedStyle === 'spiritual') {
      return destination.category === 'Pilgrimage' || destination.tags.includes('Peaceful')
    }
    if (selectedStyle === 'adventure') {
      return destination.tags.includes('Adventure') || destination.category.includes('Adventure')
    }
    return false
  })
}

export function getWeekendMatches(destinations, selectedWeekend) {
  return destinations.filter((destination) => {
    if (selectedWeekend === 'twoDay') {
      return destination.duration.includes('2–3')
    }
    if (selectedWeekend === 'threeDay') {
      return (
        destination.duration.includes('3–4') ||
        destination.duration.includes('3–5') ||
        destination.duration.includes('4–6')
      )
    }
    if (selectedWeekend === 'budgetWeekend') {
      return (
        destination.budget === 'Budget Friendly' ||
        destination.tags.includes('Budget Friendly') ||
        destination.tags.includes('Low Budget')
      )
    }
    if (selectedWeekend === 'peaceful') {
      return destination.tags.includes('Peaceful') || destination.tags.includes('Relaxing')
    }
    return false
  })
}
