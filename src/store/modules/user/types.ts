import { GetUser } from '@/api/dto'

export interface Profile extends GetUser {}

export interface UserState {
  isKeepLogin: boolean,
  isLoggedIn: boolean,
  id: number | null,
  profile: Profile | null
}
