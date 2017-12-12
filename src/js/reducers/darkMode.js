export function darkMode(state = JSON.parse(localStorage.getItem('dark-mode') || 'false'), action) {
  switch (action.type) {
    case 'TOGGLE_DARK_MODE':
      localStorage.setItem('dark-mode', !state)
      return !state
    default:
      return state
  }
}
