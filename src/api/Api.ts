import axios, { AxiosInstance, AxiosError } from 'axios'
import * as dto from './dto/index'
import ProjectPrivacy from '@/enums/ProjectPrivacy'
import AppModule from '@/store/modules/app'
import User from '@/interfaces/User'

export interface BadRequestResponse {
  errors:
    {
      type: string,
      field: string,
      code: string,
      message: string
    }[]
}

export interface OtherClientErrorResponse {
  message: string
}

class Api {
  public readonly httpClient: AxiosInstance

  constructor () {
    this.httpClient = axios.create({
      baseURL: 'https://miku.deviltea.io/api',
      withCredentials: true
    })

    this.httpClient.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response && error.response.status) {
          const status = error.response.status
          if (status === 400) {
            if (error.response.data && error.response.data.errors) {
              const data: BadRequestResponse = error.response.data
              const { errors } = data
              errors.forEach(error => {
                AppModule.addAlert({
                  type: 'error',
                  message: error.message
                })
              })
            }
          } else if (Math.floor(status / 100) === 4) {
            if (error.response.data && error.response.data.message) {
              const data: OtherClientErrorResponse = error.response.data
              const { message } = data
              AppModule.addAlert({
                type: 'error',
                message
              })
            }
          } else if (Math.floor(status / 100) === 5) {
            AppModule.addAlert({
              type: 'error',
              message: `Serverside Error: ${status}`
            })
          }
        }
        return Promise.reject(error.response)
      }
    )
  }

  public async getUserId (username: string) {
    const response = await this.httpClient.get(`/users?username=${username}`)
    const data: { id: number } = response.data
    return data.id
  }

  public async register (params: { username: string, password: string }) {
    await this.httpClient.post('/users', params)
  }

  public async validateSession () {
    await this.httpClient.get('/session')
  }

  public async login (params: { username: string, password: string }) {
    await this.httpClient.post('/session', params)
  }

  public async logout () {
    await this.httpClient.delete('/session')
  }

  private async getUser (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}`)
    const data: dto.GetUser = response.data
    return data
  }

  public async getUserById (userId: number) {
    const user: User = {
      id: userId,
      ...await this.getUser(userId)
    }
    return user
  }

  public async getUserByUsername (username: string) {
    const userId = await this.getUserId(username)
    return this.getUserById(userId)
  }

  public async getUserProjectIds (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}/projects`)
    const data: dto.GetUserProjects = response.data
    return data.projects
  }

  public async getUserIssueIds (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}/issues`)
    const data: dto.GetUserIssues = response.data
    return data.issues
  }

  public async updateUser (params: { userId: number, nickname: string, email: string, autobiography: string, lineToken: string}) {
    const { userId, nickname, email, autobiography, lineToken } = params
    await this.httpClient.put(`/users/${userId}`, {
      nickname,
      autobiography,
      email,
      lineToken
    })
  }

  public async banUser (userId: number) {
    await this.httpClient.post(`/users/${userId}/ban`)
  }

  public async unbanUser (userId: number) {
    await this.httpClient.delete(`/users/${userId}/ban`)
  }

  public async getProjectId (params: { ownerUsername: string, projectName: string }) {
    const { ownerUsername, projectName } = params
    const response = await this.httpClient.get(`/projects?owner_username=${ownerUsername}&project_name=${projectName}`)
    const data: number = response.data
    return data
  }

  public async getProject (projectId: number) {
    const response = await this.httpClient.get(`/projects/${projectId}`)
    const data: dto.GetProject = response.data
    return data
  }

  public async createProject (params: { name: string, description: string, privacy: ProjectPrivacy, tags: string[] }) {
    await this.httpClient.post(`/projects`, params)
  }

  public async updateProject (params: { projectId:number, name: string, description: string, privacy: ProjectPrivacy, tags: string[] }) {
    const { projectId, ...requestBody } = params
    await this.httpClient.put(`/projects/${projectId}`, requestBody)
  }

  public async deleteProject (projectId:number) {
    await this.httpClient.delete(`/projects/${projectId}`)
  }

  public async findProjectIds (projectName: string) {
    const response = await this.httpClient.get(`/query/projects?name=${projectName}`)
    const data: dto.FindProjects = response.data
    return data.projects
  }

  public async transferProjectOwner (params: { projectId: number, newOwnerId: number }) {
    const { projectId, newOwnerId } = params
    await this.httpClient.put(`/projects/${projectId}/owner`, {
      id: newOwnerId
    })
  }

  public async setProjectPrivacy (params: { projectId: number, privacy: number }) {
    const { projectId, privacy } = params
    await this.httpClient.put(`/projects/${projectId}/privacy`, {
      privacy
    })
  }

  public async getProjectMemberIds (projectId: number) {
    const response = await this.httpClient.get(`/projects/${projectId}/members`)
    const data: dto.GetProjectMembers = response.data
    return data.members
  }

  public async addUserToProjectMembers (params: { userId: number, projectId: number }) {
    const { userId, projectId } = params
    await this.httpClient.post(`/projects/${projectId}/members`, {
      id: userId
    })
  }

  public async deleteUserFromProjectMembers (params: { userId: number, projectId: number }) {
    const { userId, projectId } = params
    await this.httpClient.delete(`/projects/${projectId}/members`, {
      data: {
        id: userId
      }
    })
  }

  public async getProjectLabelIds (projectId: number) {
    const response = await this.httpClient.get(`/projects/${projectId}/labels`)
    const data: dto.GetProjectLabels = response.data
    return data.labels
  }

  public async getProjectLabel (labelId: number) {
    const response = await this.httpClient.get(`/labels/${labelId}`)
    const data: dto.GetProjectLabel = response.data
    return data
  }

  public async createProjectLabel (params: { projectId: number, name: string, description: string, color: string }) {
    const { projectId, ...requestBody } = params
    await this.httpClient.post(`/projects/${projectId}/labels`, requestBody)
  }

  public async updateProjectLabel (params: { labelId: number, name: string, description: string, color: string }) {
    const { labelId, ...requestBody } = params
    await this.httpClient.put(`/labels/${labelId}`, requestBody)
  }

  public async deleteProjectLabel (labelId: number) {
    await this.httpClient.delete(`/labels/${labelId}`)
  }

  public async getProjectIssueIds (projectId: number) {
    const response = await this.httpClient.get(`/projects/${projectId}/issues`)
    const data: dto.GetProjectIssues = response.data
    return data.issues
  }

  public async createProjectIssue (params: { projectId: number, title: string, comment: { content: string }, labels: number[], assignees: number[] }) {
    const { projectId, ...requestBody } = params
    await this.httpClient.post(`/projects/${projectId}/issues`, requestBody)
  }

  public async getProjectIssue (issueId: number) {
    const response = await this.httpClient.get(`/issues/${issueId}`)
    const data: dto.GetProjectIssue = response.data
    return data
  }

  public async updateProjectIssue (params: { issueId: number, title: string, labels: number[], assignees: number[] }) {
    const { issueId, ...requestBody } = params
    await this.httpClient.put(`/issues/${issueId}`, requestBody)
  }

  public async deleteProjectIssue (issueId:number) {
    await this.httpClient.delete(`/issues/${issueId}`)
  }

  public async getIssueCommentIds (issueId: number) {
    const response = await this.httpClient.get(`/issues/${issueId}/comments`)
    const data: dto.GetIssueComments = response.data
    return data.comments
  }

  public async createIssueComment (params: { issueId: number, content: string }) {
    const { issueId, ...requestBody } = params
    await this.httpClient.post(`/issues/${issueId}/comments`, requestBody)
  }

  public async getIssueComment (commentId: number) {
    const response = await this.httpClient.get(`/comments/${commentId}`)
    const data: dto.GetIssueComment = response.data
    return data
  }

  public async updateIssueComment (params: { commentId: number, content: string }) {
    const { commentId, ...requestBody } = params
    await this.httpClient.put(`/comments/${commentId}`, requestBody)
  }

  public async setIssueCommentStatus (params: { commentId: number, status: boolean }) {
    const { commentId, ...requestBody } = params
    await this.httpClient.put(`/comments/${commentId}/status`, requestBody)
  }
}

export default new Api()
