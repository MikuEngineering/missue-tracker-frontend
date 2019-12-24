<template>
  <v-container
    class="view-container"
    :class="{ 'fill-height': isProjectNotFound }"
  >
    <div
      v-if="isProjectNotFound"
      class="fill-parent d-flex justify-center align-center display-3 grey--text lighten-3 text-center"
    >
      Project Not Found
    </div>
    <v-container v-else fluid>
      <div class="project-info">
        <p class="project-info__name display-2">{{ project.name }}</p>
        <p class="project-info__date subheader-1 grey--text text--lighten-1">
          {{ createdDateString }}
        </p>
        <p
          class="project-info__description subheader-1 grey--text overflow-auto"
        >
          {{ project.description }}
        </p>
        <TagField v-model="project.tags" :readonly="true"></TagField>
        <IssueList :issue-infos="issueInfos"></IssueList>
      </div>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { Route } from 'vue-router'
import TagField from '@/components/project/TagField.vue'
import IssueList from '@/components/project/IssueList.vue'
import { GetProject as Project, GetProjectLabel as Label, GetProjectIssue as Issue, GetUser as User } from '@/api/dto'
import Api from '@/api/Api'
import { apiErrorHandler } from '@/utils/util'
import { app as AppModule, user as UserModule } from '@/store/modules'
import IssueStatus from '../enums/IssueStatus'

const api = Api.getInstance()

interface IssueInfo {
  title: string,
  number: number,
  status: IssueStatus
  owner: User,
  assignees: User[],
  labels: Label[],
  createdTime: Date,
  numOfComments: number
}

@Component({
  components: {
    TagField,
    IssueList
  }
})
export default class ProjectView extends Vue {
  id: number | null = null
  project: Project | null = null
  members: User[] = []
  issueIds: number[] = []
  issues: Issue[] = []
  issueInfos: IssueInfo[] = []

  get isOwner () {
    if (this.id === null || this.project === null) return false
    return UserModule.id === this.project.ownerId
  }

  get createdDateString () {
    if (this.project === null) return ''
    let splited = new Date(this.project.createdDate).toDateString().split(' ')
    splited.shift()
    return `${splited[1]} ${splited[0]}, ${splited[2]}`
  }

  get isProjectNotFound () {
    return this.id === null
  }

  async updateIssues () {
    await this.$nextTick()
    if (this.id === null) return
    try {
      AppModule.setIsPageLoading(true)
      this.issueIds = await api.getProjectIssues(this.id)
      this.issues = await Promise.all(this.issueIds.map(issueId => api.getProjectIssue(issueId)))
      this.issueInfos = await Promise.all(this.issues.map(async issue => {
        const owner = await api.getUser(issue.owner)
        const assignees = await Promise.all(issue.assignees.map(async id => {
          const assignee = await api.getUser(id)
          return assignee
        }))
        const labels = await Promise.all(issue.labels.map(async id => {
          const label = await api.getProjectLabel(id)
          return label
        }))
        return {
          title: issue.title,
          number: issue.number,
          status: issue.status,
          owner,
          assignees,
          labels,
          createdTime: new Date(issue.createdTime),
          numOfComments: 0
        }
      }))
      AppModule.setIsPageLoading(false)
    } catch (error) {
      apiErrorHandler(error)
    }
  }

  async beforeRouteEnter (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    const { username: ownerUsername, projectName } = to.params
    try {
      const targetId = await api.getProjectIdByOwnerNameAndProjectName({
        ownerUsername,
        projectName
      })
      const targetProject = await api.getProject(targetId)
      next((vm: ProjectView) => {
        vm.id = targetId
        vm.project = targetProject
      })
    } catch (error) {
      apiErrorHandler(error)
      next()
    }
    AppModule.setIsPageLoading(false)
  }

  async beforeRouteUpdate (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    const { username: ownerUsername, projectName } = to.params
    try {
      const targetId = await api.getProjectIdByOwnerNameAndProjectName({
        ownerUsername,
        projectName
      })
      const targetProject = await api.getProject(targetId)
      this.id = targetId
      this.project = targetProject
      next()
    } catch (error) {
      apiErrorHandler(error)
      next()
    }
    AppModule.setIsPageLoading(false)
  }

  mounted () {
    this.updateIssues()
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/mixins/breakpoints";
@import "@/styles/shared/util";

.view-container {
  max-width: 900px;

  .project-info {
    &__name {
    }

    &__date {
    }

    &__description {
      @include no-scrollbar;
    }
  }
}
</style>
