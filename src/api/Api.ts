import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import * as dto from './dto/index'
import ErrorCode from '@/enums/ErrorCode'
import ProjectPrivacy from '@/enums/ProjectPrivacy'

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

interface ErrorHandlers {
  [key: number]: Function
}

export class ApiError extends Error {
  public code: ErrorCode
  public data: any

  constructor (code: ErrorCode = ErrorCode.Unknown, data?: any) {
    super(ErrorCode[code])
    Object.setPrototypeOf(this, new.target.prototype)
    this.code = code
    this.data = data
  }
}

export default class Api {
  private static instance: Api | null = null;
  public readonly httpClient: AxiosInstance

  private constructor () {
    this.httpClient = axios.create({
      baseURL: 'https://miku.deviltea.io/api',
      withCredentials: true
    })

    this.httpClient.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => Promise.reject(error.response)
    )
  }

  public static getInstance () {
    if (Api.instance === null) Api.instance = new Api()
    return Api.instance
  }

  public async getUserIdByUsername (username: string) {
    const response = await this.httpClient.get(`/users?username=${username}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.UserNotFound, data)
        }
        throw handlers[status]()
      })
    const data: { id: number } = response.data
    return data.id
  }

  public async register (params: { username: string, password: string }) {
    await this.httpClient.post('/users', params)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          409: () => new ApiError(ErrorCode.UserConflict, data)
        }
        throw handlers[status]()
      })
  }

  public async validateSession () {
    await this.httpClient.get('/session')
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          404: () => new ApiError(ErrorCode.SessionNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async login (params: { username: string, password: string }) {
    await this.httpClient.post('/session', params)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserBanned, data)
        }
        throw handlers[status]()
      })
  }

  public async logout () {
    await this.httpClient.delete('/session')
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          401: () => new ApiError(ErrorCode.UserUnauthorized, data)
        }
        throw handlers[status]()
      })
  }

  public async getUser (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          404: () => new ApiError(ErrorCode.UserNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetUser = response.data
    return data
  }

  public async getUserProjectIds (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}/projects`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.UserNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetUserProjects = response.data
    return data.projects
  }

  public async getUserIssueIds (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}/issues`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.UserNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetUserIssues = response.data
    return data.issues
  }

  public async updateUser (params: { userId: number, nickname: string, email: string, autobiography: string }) {
    const { userId, nickname, email, autobiography } = params
    await this.httpClient.put(`/users/${userId}`, {
      nickname,
      autobiography,
      email
    })
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.UserNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async banUser (userId: number) {
    await this.httpClient.post(`/users/${userId}/ban`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.UserNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async unbanUser (userId: number) {
    await this.httpClient.delete(`/users/${userId}/ban`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.UserNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async getProjectIdByOwnerNameAndProjectName (params: { ownerUsername: string, projectName: string }) {
    const { ownerUsername, projectName } = params
    const response = await this.httpClient.get(`/projects?owner_username=${ownerUsername}&project_name=${projectName}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data)
        }
        throw handlers[status]()
      })
    // const data: dto.GetProjectId = response.data
    const data: number = response.data
    return data
  }

  public async getProject (projectId: number) {
    const response = await this.httpClient.get(`/projects/${projectId}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          404: () => new ApiError(ErrorCode.ProjectNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetProject = response.data
    return data
  }

  public async createProject (params: { name: string, description: string, privacy: ProjectPrivacy, tags: string[] }) {
    await this.httpClient.post(`/projects`, params)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          409: () => new ApiError(ErrorCode.ProjectConflict, data)
        }
        throw handlers[status]()
      })
  }

  public async updateProject (params: { projectId:number, name: string, description: string, privacy: ProjectPrivacy, tags: string[] }) {
    const { projectId, ...requestBody } = params
    await this.httpClient.put(`/projects/${projectId}`, requestBody)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data),
          409: () => new ApiError(ErrorCode.ProjectConflict, data)
        }
        throw handlers[status]()
      })
  }

  public async deleteProject (projectId:number) {
    await this.httpClient.delete(`/projects/${projectId}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async findProjectIds (projectName: string) {
    const response = await this.httpClient.get(`/projects?q=${projectName}`)
    const data: dto.FindProjects = response.data
    return data.projects
  }

  public async transferProjectOwner (params: { projectId: number, newOwnerId: number }) {
    const { projectId, newOwnerId } = params
    await this.httpClient.put(`/projects/${projectId}/owner`, {
      id: newOwnerId
    })
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.UserOrProjectNotFound, data),
          409: () => new ApiError(ErrorCode.ProjectConflict, data)
        }
        throw handlers[status]()
      })
  }

  public async setProjectPrivacy (params: { projectId: number, privacy: number }) {
    const { projectId, privacy } = params
    await this.httpClient.put(`/projects/${projectId}/privacy`, {
      privacy
    })
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async getProjectMembers (projectId: number) {
    const response = await this.httpClient.get(`/projects/${projectId}/members`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetProjectMembers = response.data
    return data.members
  }

  public async addUserToProjectMembers (params: { userId: number, projectId: number }) {
    const { userId, projectId } = params
    await this.httpClient.post(`/projects/${projectId}/members`, {
      id: userId
    })
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.UserOrProjectNotFound, data),
          409: () => new ApiError(ErrorCode.UserConflict, data)
        }
        throw handlers[status]()
      })
  }

  public async deleteUserFromProjectMembers (params: { userId: number, projectId: number }) {
    const { userId, projectId } = params
    await this.httpClient.delete(`/projects/${projectId}/members`, {
      data: {
        id: userId
      }
    })
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.UserOrProjectNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async getProjectLabels (projectId: number) {
    const response = await this.httpClient.get(`/projects/${projectId}/labels`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetProjectLabels = response.data
    return data.labels
  }

  public async getProjectLabel (labelId: number) {
    const response = await this.httpClient.get(`/labels/${labelId}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetProjectLabel = response.data
    return data
  }

  public async createProjectLabel (params: { projectId: number, name: string, description: string, color: string }) {
    const { projectId, ...requestBody } = params
    await this.httpClient.post(`/projects/${projectId}/labels`, requestBody)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data),
          409: () => new ApiError(ErrorCode.LabelConlict, data)
        }
        throw handlers[status]()
      })
  }

  public async updateProjectLabel (params: { labelId: number, name: string, description: string, color: string }) {
    const { labelId, ...requestBody } = params
    await this.httpClient.put(`/labels/${labelId}`, requestBody)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.LabelNotFound, data),
          409: () => new ApiError(ErrorCode.LabelConlict, data)
        }
        throw handlers[status]()
      })
  }

  public async deleteProjectLabel (labelId: number) {
    await this.httpClient.delete(`/labels/${labelId}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.LabelNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async getProjectIssues (projectId: number) {
    const response = await this.httpClient.get(`/projects/${projectId}/issues`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetProjectIssues = response.data
    return data.issues
  }

  public async createProjectIssue (params: { projectId: number, title: string, comment: { content: string }, labels: number[], assignees: number[] }) {
    const { projectId, ...requestBody } = params
    await this.httpClient.post(`/projects/${projectId}/issues`, requestBody)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.ProjectNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async getProjectIssue (issueId: number) {
    const response = await this.httpClient.get(`/issues/${issueId}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.IssueNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetProjectIssue = response.data
    return data
  }

  public async updateProjectIssue (params: { issueId: number, title: string, labels: number[], assignees: number[] }) {
    const { issueId, ...requestBody } = params
    await this.httpClient.put(`/issues/${issueId}`, requestBody)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.IssueNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async deleteProjectIssue (issueId:number) {
    await this.httpClient.delete(`/issues/${issueId}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.IssueNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async getIssueComments (issueId: number) {
    const response = await this.httpClient.get(`/issues/${issueId}/comments`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.IssueNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetIssueComments = response.data
    return data.comments
  }

  public async createIssueComment (params: { issueId: number, content: string }) {
    const { issueId, ...requestBody } = params
    await this.httpClient.post(`/issues/${issueId}/comments`, requestBody)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          404: () => new ApiError(ErrorCode.IssueNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async getIssueComment (commentId: number) {
    const response = await this.httpClient.get(`/comments/${commentId}`)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          404: () => new ApiError(ErrorCode.CommentNotFound, data)
        }
        throw handlers[status]()
      })
    const data: dto.GetIssueComment = response.data
    return data
  }

  public async updateIssueComment (params: { commentId: number, content: string }) {
    const { commentId, ...requestBody } = params
    await this.httpClient.put(`/comments/${commentId}`, requestBody)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.CommentNotFound, data)
        }
        throw handlers[status]()
      })
  }

  public async setIssueCommentStatus (params: { commentId: number, status: boolean }) {
    const { commentId, ...requestBody } = params
    await this.httpClient.put(`/comments/${commentId}/status`, requestBody)
      .catch((response: AxiosResponse) => {
        const { status, data } = response
        const handlers: ErrorHandlers = {
          400: () => new ApiError(ErrorCode.BadRequest, data),
          401: () => new ApiError(ErrorCode.UserUnauthorized, data),
          403: () => new ApiError(ErrorCode.UserPermissionDenied, data),
          404: () => new ApiError(ErrorCode.CommentNotFound, data)
        }
        throw handlers[status]()
      })
  }
}
