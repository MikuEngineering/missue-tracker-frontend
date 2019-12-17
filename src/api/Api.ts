import axios, { AxiosInstance } from 'axios'
import * as dto from './dto/index'

export default class Api {
  public readonly httpClient: AxiosInstance

  constructor () {
    this.httpClient = axios.create({
      baseURL: 'https://miku.deviltea.io/api',
      withCredentials: true
    })
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
    try {
      await this.httpClient.get('/session')
      return true
    } catch (error) {
      if (error && error.response && error.response.status && error.response.status === 404) {
        return false
      } else {
        throw error
      }
    }
  }

  public async login (params: { username: string, password: string }) {
    await this.httpClient.post('/session', params)
  }

  public async logout () {
    try {
      await this.httpClient.delete('/session')
    } catch (error) {
      if (!(error && error.response && error.response.status && error.response.status === 401)) {
        throw error
      }
    }
  }

  public async getUser (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}`)
    const data: dto.GetUser = response.data
    return data
  }

  public async getUserProjectIds (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}/projects`)
    const data: dto.GetUserProjectIds = response.data
    return data.projects
  }

  public async getUserIssueIds (userId: number) {
    const response = await this.httpClient.get(`/users/${userId}/issues`)
    const data: dto.GetUserIssueIds = response.data
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

  public async getProjectIdByOwnerNameAndProjectName (params: { ownerName: string, projectName: string }) {
    const { ownerName, projectName } = params
    const response = await this.httpClient.get(`/projects?owner_name=${ownerName}&project_name=${projectName}`)
    const data: dto.GetProjectIdByOwnerNameAndProjectName = response.data
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
    const data: dto.FindProjectIdsByProjectName = response.data
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
    await this.httpClient.get(`/project/${projectId}/members`)
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
}
