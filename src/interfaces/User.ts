import UserStatus from '@/enums/UserStatus'
import UserPermission from '@/enums/UserPermission'

interface User {
  id: number;
  username: string;
  nickname: string;
  autobiography: string;
  email: string;
  status: UserStatus;
  permission: UserPermission;
  lineToken: string;
}

export default User
