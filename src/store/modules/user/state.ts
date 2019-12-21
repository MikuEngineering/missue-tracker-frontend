import { UserState } from './types'

const state: UserState = {
  isKeepLogin: !!JSON.parse(localStorage.getItem('keepLogin') || 'false'),
  id: null,
  isLoggedIn: false,
  profile: null
}

export default state
