import IssueStatus from '@/enums/IssueStatus'
import md5 from 'js-md5'

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

export function getGravatarUrl (email: string, size?: number) {
  const hash = md5(email)
  return `https://www.gravatar.com/avatar/${hash}${size ? `?s=${size}` : ''}`
}
