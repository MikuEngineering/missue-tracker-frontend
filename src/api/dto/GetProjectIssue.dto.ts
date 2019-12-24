import IssueStatus from '@/enums/IssueStatus'

export default interface GetProjectIssue {
  title: string,
  number: number,
  owner: number,
  labels: number[],
  assignees: number[]
  createdTime: string,
  updatedTime: string,
  status: IssueStatus
}
