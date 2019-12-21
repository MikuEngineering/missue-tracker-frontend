import { UserState } from './types'

const state: UserState = {
  keepLogin: JSON.parse(localStorage.getItem('keepLogin') || 'false'),
  id: null,
  isLoggedIn: false,
  profile: null
}

export default state
