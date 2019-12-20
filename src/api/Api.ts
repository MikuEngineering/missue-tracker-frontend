import axios, { AxiosInstance } from 'axios'
import * as dto from './dto/index'

export default class Api {
  private static instance: Api | null = null;
  public readonly httpClient: AxiosInstance

  private constructor () {
    this.httpClient = axios.create({
      baseURL: 'https://miku.deviltea.io/api',
      withCredentials: true
    })
  }

  public static getInstance () {
    if (Api.instance === null) Api.instance = new Api()
    return Api.instance
  }

  public async getUserIdByUsername (username: string) {
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

  public async getUser (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}`)
    const data: dto.GetUser = response.data
    return data
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

  public async updateUser (params: { userId: number, nickname?: string, autobiography?: string }) {
    const { userId, nickname, autobiography } = params
    await this.httpClient.patch(`/users/${userId}`, {
      nickname,
      autobiography
    })
  }

  public async banUser (userId: number) {
    await this.httpClient.post(`/users/${userId}/ban`)
  }

  public async unbanUser (userId: number) {
    await this.httpClient.delete(`/users/${userId}/ban`)
  }

  public async getProjectIdByOwnerNameAndProjectName (params: { ownerUserame: string, projectName: string }) {
    const { ownerUserame, projectName } = params
    const response = await this.httpClient.get(`/projects?owner_username=${ownerUserame}&project_name=${projectName}`)
    const data: dto.GetProjectId = response.data
    return data.id
  }

  public async getProject (projectId: number) {
    const response = await this.httpClient.get(`/projects/${projectId}`)
    const data: dto.GetProject = response.data
    return data
  }

  public async createProject (params: { name: string, description: string, privacy: string, tags: string[] }) {
    await this.httpClient.post(`/projects`, params)
  }

  public async updateProject (params: { projectId:number, name: string, description: string, privacy: string, tags: string[] }) {
    const { projectId, ...requestBody } = params
    await this.httpClient.put(`/projects/${projectId}`, requestBody)
  }

  public async deleteProject (projectId:number) {
    await this.httpClient.delete(`/projects/${projectId}`)
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
  }

  public async setProjectPrivacy (params: { projectId: number, privacy: number }) {
    const { projectId, privacy } = params
    await this.httpClient.put(`/projects/${projectId}/privacy`, {
      privacy
    })
  }

  public async getProjectMembers (projectId: number) {
    const response = await this.httpClient.get(`/project/${projectId}/members`)
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

  public async getProjectLabels (projectId: number) {
    const response = await this.httpClient.get(`/api/projects/${projectId}/labels`)
    const data: dto.GetProjectLabels = (await response).data
    return data.labels
  }

  public async getProjectLabel (labelId: number) {
    const response = await this.httpClient.get(`/api/labels/${labelId}`)
    const data: dto.GetProjectLabel = response.data
    return data
  }

  public async createProjectLabel (params: { projectId: number, name: string, description: string, color: string }) {
    const { projectId, ...requestBody } = params
    await this.httpClient.post(`/api/projects/${projectId}/labels`, requestBody)
  }

  public async updateProjectLabel (params: { labelId: number, name: string, description: string, color: string }) {
    const { labelId, ...requestBody } = params
    await this.httpClient.put(`/api/labels/${labelId}`, requestBody)
  }

  public async deleteProjectLabel (labelId: number) {
    await this.httpClient.delete(`/api/labels/${labelId}`)
  }

  public async getProjectIssues (projectId: number) {
    const response = await this.httpClient.get(`/api/projects/${projectId}/issues`)
    const data: dto.GetProjectIssues = response.data
    return data.issues
  }

  public async createProjectIssue (params: { projectId: number, title: string, comment: { content: string }, labels: number[], asignees: number[] }) {
    const { projectId, ...requestBody } = params
    await this.httpClient.post(`/api/projects/${projectId}/issues`, requestBody)
  }

  public async updateProjectIssue (params: { issueId: number, title: string, labels: number[], asignees: number[] }) {
    const { issueId, ...requestBody } = params
    await this.httpClient.put(`/api/issues/${issueId}`, requestBody)
  }

  public async deleteProjectIssue (issueId:number) {
    await this.httpClient.delete(`/issues/${issueId}`)
  }

  public async getIssueComments (issueId: number) {
    const response = await this.httpClient.get(`/api/issues/${issueId}/comments`)
    const data: dto.GetIssueComments = response.data
    return data.comments
  }

  public async createIssueComment (params: { issueId: number, content: string }) {
    const { issueId, ...requestBody } = params
    await this.httpClient.post(`/api/issues/${issueId}/comments`, requestBody)
  }

  public async getIssueComment (commentId: number) {
    const response = await this.httpClient.get(`/api/comments/${commentId}`)
    const data: dto.GetIssueComment = response.data
    return data
  }

  public async updateIssueComment (params: { commentId: number, content: string }) {
    const { commentId, ...requestBody } = params
    await this.httpClient.put(`/api/comments/${commentId}`, requestBody)
  }

  public async setIssueCommentStatus (params: { commentId: number, status: boolean }) {
    const { commentId, ...requestBody } = params
    await this.httpClient.put(`/api/comments/${commentId}/status`, requestBody)
  }
}
