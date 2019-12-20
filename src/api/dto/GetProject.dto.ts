import ProjectPrivacy from '@/enums/ProjectPrivacy'

export default interface GetProject {
  name: string,
  createdDate: string // new Date(createdDate)
  description: string,
  privacy: ProjectPrivacy,
  tags: string[]
}
