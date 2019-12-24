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
      <MemberEditDialog
        v-model="showingMemberEditDialog"
        :members="members"
        :id="id"
        :project-id="id"
        :owner="this.project.ownerId"
        @action-done="updateMembers"
        @transfer-project="projectTransferred"
      >
      </MemberEditDialog>
      <ProjectEditDialog
        v-model="showingProjectEditDialog"
        mode="edit"
        :id="id"
        :project="project"
        @action-done="updateProjectInfo"
      ></ProjectEditDialog>
      <div class="project-info">
        <v-row>
          <v-col cols="12" sm="8">
            <p class="mb-0">
              <v-chip
                outlined
                x-small
                :color="isPrivate ? 'warning' : 'success'"
                :text-color="isPrivate ? 'warning' : 'success'"
              >
                {{ isPrivate ? "Private" : "Public" }}
              </v-chip>
            </p>
            <div class="d-flex align-center">
              <p
                class="project-info__name display-1 mb-1 overflow-auto-x no-scrollbar"
              >
                {{ project.name }}
              </p>
              <v-btn
                v-if="isMember"
                icon
                class="ml-2"
                @click="showingProjectEditDialog = true"
              >
                <v-icon>
                  mdi-settings
                </v-icon>
              </v-btn>
            </div>
            <p
              class="project-info__date subheader-1 grey--text text--lighten-1"
            >
              <span>{{ createdDateString }}</span>
            </p>
            <p
              class="project-info__description subheader-1 grey--text overflow-auto"
            >
              {{ project.description }}
            </p>
            <TagField v-model="project.tags" :readonly="true"></TagField>
          </v-col>
          <v-col cols="12" sm="4">
            <v-container class="fill-height">
              <v-row class="fill-height">
                <v-divider
                  v-if="$vuetify.breakpoint.smAndUp"
                  vertical
                  class="mr-2"
                ></v-divider>
                <div class="fill-height d-flex flex-column">
                  <div>
                    <div class="d-flex align-center mb-2">
                      <p class="headline grey--text mb-0">
                        Members
                      </p>
                      <v-btn
                        v-if="isOwner || isAdmin"
                        icon
                        small
                        class="ml-1"
                        @click="showingMemberEditDialog = true"
                      >
                        <v-icon>
                          mdi-settings
                        </v-icon>
                      </v-btn>
                    </div>
                    <p class="full-max-width overflow-x no-scrollbar">
                      <v-tooltip
                        v-for="(member, index) in members"
                        :key="`member-avatar-${index}`"
                        bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-avatar
                            v-on="on"
                            @click="goToUserProfile(member.username)"
                            size="36"
                            :class="{ 'ml-2': index > 0 }"
                          >
                            <img :src="getGravatarUrl(member.email)" />
                          </v-avatar>
                        </template>
                        <span>{{ member.nickname }}</span>
                      </v-tooltip>
                    </p>
                  </div>
                  <div>
                    <div class="d-flex align-center mb-2">
                      <p class="headline grey--text mb-0">
                        Labels
                      </p>
                      <v-btn v-if="isOwner || isAdmin" icon small class="ml-1">
                        <v-icon>
                          mdi-settings
                        </v-icon>
                      </v-btn>
                    </div>
                    <p class="full-max-width overflow-x no-scrollbar">
                      <v-tooltip
                        v-for="(label, index) in labels"
                        :key="`label-${index}`"
                        bottom
                      >
                        <template v-slot:activator="{ on }">
                          <v-chip
                            dark
                            :color="`#${label.color}`"
                            v-on="on"
                            :class="{ 'ml-2': index > 0 }"
                            >{{ label.name }}</v-chip
                          >
                        </template>
                        <span>{{ label.description }}</span>
                      </v-tooltip>
                    </p>
                  </div>
                </div>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </div>
      <div class="d-flex align-center">
        <p class="headline grey--text ma-0">Issues</p>
        <v-btn color="warning" rounded outlined small class="ml-2">
          <span>Add</span>
        </v-btn>
      </div>
      <IssueList :issue-infos="issueInfos"></IssueList>
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
import { apiErrorHandler, getGravatarUrl } from '@/utils/util'
import { app as AppModule, user as UserModule } from '@/store/modules'
import ProjectEditDialog from '@/components/project/ProjectEditDialog.vue'
import MemberEditDialog from '@/components/project/MemberEditDialog.vue'
import IssueStatus from '../enums/IssueStatus'
import ProjectPrivacy from '../enums/ProjectPrivacy'

const api = Api.getInstance()

interface Member extends User {
  id: number
}

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
    ProjectEditDialog,
    MemberEditDialog,
    TagField,
    IssueList
  }
})
export default class ProjectView extends Vue {
  id: number | null = null
  project: Project | null = null
  members: Member[] = []
  labels: Label[] = []
  issueIds: number[] = []
  issues: Issue[] = []
  issueInfos: IssueInfo[] = []
  showingProjectEditDialog: boolean = false
  showingMemberEditDialog: boolean = false

  get isPrivate () {
    if (this.project === null) return false
    return this.project.privacy === ProjectPrivacy.Private
  }

  get isAdmin () {
    return UserModule.isAdmin
  }

  get isOwner () {
    if (this.id === null || this.project === null) return false
    return UserModule.id === this.project.ownerId
  }

  get isMember () {
    if (this.id === null || this.project === null) return false
    return !!this.members.find(member => member.id === UserModule.id)
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

  getGravatarUrl (email: string) {
    return getGravatarUrl(email)
  }

  goToUserProfile (username: string) {
    this.$router.push({
      name: 'profile',
      params: {
        username
      }
    })
  }

  async beforeRouteEnter (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    const { username: ownerUsername, projectName } = to.params
    try {
      const targetId = await api.getProjectIdByOwnerNameAndProjectName({
        ownerUsername,
        projectName
      })
      const [targetProject, targetMemberIds, targetLabelIds] = await Promise.all([
        api.getProject(targetId),
        api.getProjectMembers(targetId),
        api.getProjectLabels(targetId)
      ])
      const [targetMembers, targetLabels] = await Promise.all([
        Promise.all(targetMemberIds.map(id => api.getUser(id))),
        Promise.all(targetLabelIds.map(id => api.getProjectLabel(id)))
      ])
      next((vm: ProjectView) => {
        vm.id = targetId
        vm.project = targetProject
        vm.members = targetMembers.map((user, index) => ({ ...user, id: targetMemberIds[index] }))
        vm.labels = targetLabels
        vm.updateIssues()
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
      const [targetProject, targetMemberIds, targetLabelIds] = await Promise.all([
        api.getProject(targetId),
        api.getProjectMembers(targetId),
        api.getProjectLabels(targetId)
      ])
      const [targetMembers, targetLabels] = await Promise.all([
        Promise.all(targetMemberIds.map(id => api.getUser(id))),
        Promise.all(targetLabelIds.map(id => api.getProjectLabel(id)))
      ])
      this.id = targetId
      this.project = targetProject
      this.members = targetMembers.map((user, index) => ({ ...user, id: targetMemberIds[index] }))
      this.labels = targetLabels
      this.updateIssues()
      next()
    } catch (error) {
      apiErrorHandler(error)
      next()
    }
    AppModule.setIsPageLoading(false)
  }

  async projectTransferred (username: string) {
    if (this.project === null) return
    AppModule.setIsPageLoading(true)
    await this.$router.replace({
      name: 'project',
      params: {
        username,
        projectName: this.project.name
      }
    }).catch(() => {})
    AppModule.setIsPageLoading(false)
  }

  async updateMembers () {
    if (this.id === null) return
    AppModule.setIsPageLoading(true)
    const memberIds = await api.getProjectMembers(this.id)
    const members = await Promise.all(memberIds.map(id => api.getUser(id)))
    this.members = members.map((user, index) => ({ ...user, id: memberIds[index] }))
    AppModule.setIsPageLoading(false)
  }

  async updateProjectInfo () {
    if (this.id === null) return
    AppModule.setIsPageLoading(true)
    this.project = await api.getProject(this.id)
    await this.$router.replace({
      name: 'project',
      params: {
        username: this.$route.params.username,
        projectName: this.project.name
      }
    }).catch(() => {})
    AppModule.setIsPageLoading(false)
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
      max-width: 250px;
      white-space: nowrap;
    }

    &__date {
    }

    &__description {
      @include no-scrollbar;
    }
  }
}
</style>
