import UserPermission from '@/enums/UserPermission'
import UserStatus from '@/enums/UserStatus'

export default interface GetUser {
  username: string,
  nickname: string,
  autobiography: string,
  email: string,
  status: UserStatus,
  permission: UserPermission,
  lineToken: string
}
