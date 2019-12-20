import UserPermission from '@/enums/UserPermission'

export default interface GetUser {
  username: string,
  nickname: string,
  autobiography: string,
  avatar: string,
  permission: UserPermission
}
