export function setUser(user, token) {
  return {
    type: 'SET_USER',
    user,
    token
  }
}
