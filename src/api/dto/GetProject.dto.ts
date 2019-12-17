export default interface GetProject {
  name: string,
  createdDate: string // new Date(createdDate)
  description: string,
  privacy: number,
  tags: string[]
}
