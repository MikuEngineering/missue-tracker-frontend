<template>
  <div
    v-if="isIssueNotFound"
    class="fill-parent d-flex justify-center align-center display-3 grey--text lighten-3 text-center"
  >
    Issue Not Found
  </div>
  <v-container v-else class="view-container">
    <v-row>
      <v-col cols="12" sm="8">
        <p class="mb-1">
          <v-chip small class="px-8" dark :color="isOpen ? 'success' : 'error'">
            {{ isOpen ? "Open" : "Closed" }}
          </v-chip>
        </p>
        <p class="display-1 mb-1">{{ issueInfo.title }}</p>
        <p class="subheader-2 grey--text mb-1">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-avatar
                v-on="on"
                @click="goToUserProfile(issueInfo.owner.username)"
                size="36"
                class="mr-2"
              >
                <img :src="getGravatarUrl(issueInfo.owner.email)" />
              </v-avatar>
            </template>
            <span>{{ issueInfo.owner.nickname }}</span>
          </v-tooltip>
          opened at {{ issueInfo.createdTime.toDateString() }}
        </p>
      </v-col>
      <v-col cols="12" sm="4">
        <p class="mb-1 subheader-2 grey--text">Assigned To</p>
        <p class="mb-1">
          <v-tooltip
            v-for="(member, index) in issueInfo.assignees"
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
        <p class="mb-1 subheader-2 grey--text">Labels</p>
        <p class="mb-1">
          <v-tooltip
            v-for="(label, index) in issueInfo.labels"
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
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <IssueComment
      v-for="(commentInfo, index) in commentInfos"
      v-model="commentInfo.content"
      :key="`comment-${index}`"
      :is-editting="false"
      :owner="commentInfo.owner"
    ></IssueComment>

    <div v-if="isLoggedIn">
      <IssueComment
        v-if="user"
        v-model="newComment"
        :is-editting="true"
        :owner="user"
      ></IssueComment>
      <div class="d-flex">
        <v-btn
          class="ml-auto"
          color="success"
          :disabled="newComment.length === 0 || isCreatingComment"
          @click="createComment"
        >
          New Comment
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import api from '@/api/api'
import { Route } from 'vue-router'
import { getGravatarUrl } from '../utils/util'
import { GetProjectIssue as Issue, GetIssueComment as Comment, GetProjectLabel as Label } from '@/api/dto'
import IssueStatus from '@/enums/IssueStatus'
import AppModule from '@/store/modules/app'
import IssueComment from '@/components/issue/IssueComment.vue'
import User from '@/interfaces/User'

interface IssueInfo {
  id: number,
  title: string,
  number: number,
  status: IssueStatus
  owner: User,
  assignees: User[],
  labels: LabelInfo[],
  createdTime: Date,
}

interface LabelInfo extends Label {
  id: number
}

interface CommentInfo {
  id: number,
  content: string,
  owner: User,
  createdTime: Date,
  updatedTime: Date
}

async function getIssueInfo (issueId: number) {
  const issue = await api.getProjectIssue(issueId)
  const owner: User = {
    id: issue.owner,
    ...await api.getUserById(issue.owner)
  }
  const assignees: User[] = await Promise.all(issue.assignees.map(async id => {
    return {
      id,
      ...await api.getUserById(id)
    }
  }))
  const labels: LabelInfo[] = await Promise.all(issue.labels.map(async id => {
    return {
      id,
      ...await api.getProjectLabel(id)
    }
  }))
  const issueInfo: IssueInfo = {
    id: issueId,
    title: issue.title,
    number: issue.number,
    status: issue.status,
    owner,
    assignees,
    labels,
    createdTime: new Date(issue.createdTime)
  }
  return issueInfo
}

@Component({
  components: {
    IssueComment
  }
})
export default class IssueView extends Vue {
  issueInfo: IssueInfo | null = null
  commentInfos: CommentInfo[] = []
  newComment: string = ''
  isCreatingComment: boolean = false

  get isIssueNotFound () {
    return this.issueInfo === null
  }

  get isOpen () {
    if (this.issueInfo === null) return false
    return this.issueInfo.status === IssueStatus.Open
  }

  get user () {
    return AppModule.user
  }

  get isLoggedIn () {
    return AppModule.isLoggedIn
  }

  async createComment () {
    if (this.issueInfo === null) return
    this.isCreatingComment = true
    await api.createIssueComment({
      issueId: this.issueInfo.id,
      content: this.newComment
    })
    await this.updateComments()
    this.newComment = ''
    this.isCreatingComment = false
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

  async updateComments () {
    if (this.issueInfo === null) return
    AppModule.setIsPageLoading(true)
    try {
      const commentIds = await api.getIssueCommentIds(this.issueInfo.id)
      this.commentInfos = await Promise.all((await Promise.all(commentIds.map(id => api.getIssueComment(id))))
        .map(async (comment, index) => ({
          id: commentIds[index],
          content: comment.content,
          owner: {
            id: comment.owner,
            ...await api.getUserById(comment.owner)
          },
          createdTime: new Date(comment.createdTime),
          updatedTime: new Date(comment.updatedTime)
        })))
    } catch (error) {
    }
    AppModule.setIsPageLoading(false)
  }

  async beforeRouteEnter (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    try {
      const issueId = +to.params.issueId
      const issueInfo: IssueInfo = await getIssueInfo(issueId)
      next((vm: IssueView) => {
        vm.issueInfo = issueInfo
        vm.updateComments()
      })
    } catch (error) {
    }
    AppModule.setIsPageLoading(false)
  }

  async beforeRouteUpdate (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    try {
      const issueId = +to.params.issueId
      const issueInfo: IssueInfo = await getIssueInfo(issueId)
      this.issueInfo = issueInfo
      this.updateComments()
    } catch (error) {
    }
    AppModule.setIsPageLoading(false)
  }
}
</script>

<style lang="scss" scoped>
.view-container {
  max-width: 800px;
}
</style>
