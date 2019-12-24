import { ApiError, BadRequestResponse, OtherClientErrorResponse } from '@/api/Api'
import ErrorCode from '@/enums/ErrorCode'
import AppModule from '@/store/modules/app'
import IssueStatus from '@/enums/IssueStatus'

export function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function mockGetProjectIds () {
  await delay(300)
  // return [1, 2, 3, 4, 5, 6, 7]
  return []
}

export async function mockGetProjectInfo (projectId: number) {
  await delay(Math.floor(Math.random() * 1000 + 2000))
  return {
    name: `project-${projectId}`,
    createdDate: new Date().toJSON(),
    description: `A missue-tracker project-${projectId}.`,
    privacy: Math.floor(Math.random() * 2),
    tags: ['typescript', 'vue', 'scss']
  }
}

export async function mockGetIssueIds () {
  await delay(300)
  return ''.padEnd(29, ' ').split(' ').map((_, i) => i)
  // return []
}

export async function mockGetIssueInfo (issueId: number) {
  await delay(Math.floor(Math.random() * 500 + 500))
  return {
    title: `issue title text ${issueId}`,
    number: issueId + 1,
    owner: 1,
    labels: [1, 2, 3],
    assignees: [1],
    status: Math.floor(Math.random() * 2) ? IssueStatus.Open : IssueStatus.Closed,
    createdTime: new Date().toJSON(),
    updatedTime: new Date().toJSON()
  }
}

export function apiErrorHandler (error: Error) {
  if (!(error instanceof ApiError)) throw error

  const apiError: ApiError = error

  if (apiError.code === ErrorCode.BadRequest) {
    const data: BadRequestResponse = apiError.data
    data.errors.forEach(err => AppModule.addAlert({ type: 'error', message: err.message }))
  } else {
    const data: OtherClientErrorResponse = apiError.data
    AppModule.addAlert({ type: 'error', message: data.message })
  }
}
