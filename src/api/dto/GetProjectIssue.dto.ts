export default interface GetProjectIssue {
  title: string,
  owner: number,
  labels: number[],
  asignees: number[]
  createdTime: string,
  updatedTime: string
}
