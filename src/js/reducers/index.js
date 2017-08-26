import { combineReducers } from 'redux'

function auth(state = {}, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        user: action.user,
        token: action.token,
        authenticated: true
      }
    case 'DISCARD_USER':
      return {}
    default:
      return state
  }
}

const appReducer = combineReducers({
  auth
})

export default appReducer
