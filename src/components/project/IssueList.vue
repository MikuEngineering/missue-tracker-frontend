<template>
  <div>
    <v-tabs v-model="currentTab" background-color="transparent" class="mb-3">
      <v-tab href="#issue-open">Open {{ numOfOpenIssues }}</v-tab>
      <v-tab href="#issue-closed">Closed {{ numOfClosedIssues }}</v-tab>
    </v-tabs>
    <v-card class="issue-card fill-width">
      <v-list>
        <p
          v-if="issuesFiltered.length === 0"
          class=" display-1 grey--text text--lighten-1 text-center my-3"
        >
          No Issues
        </p>
        <template v-else>
          <template v-for="(issue, index) in issuesFiltered">
            <v-divider
              :key="`issue-item-divider-${index}`"
              v-if="index !== 0"
              v-show="$vuetify.breakpoint.xs"
            ></v-divider>
            <v-list-item
              :key="`issue-item-${index}`"
              two-line
              class="py-2"
              :class="`px-${$vuetify.breakpoint.xs ? 4 : 8}`"
              @click="goToIssue(issue.id)"
            >
              <v-row no-gutters class="my-2">
                <v-col cols="12" sm="1">
                  <span class="headline">#{{ issue.number }}</span>
                </v-col>
                <v-col cols="12" sm="9" class="d-flex flex-column my-1">
                  <span class="subheader-1 text-truncate">
                    {{ issue.title }}
                  </span>
                  <div>
                    <v-chip
                      v-for="(label, labelIndex) in issue.labels"
                      :key="`issue-label-${labelIndex}`"
                      class="text-capitalize"
                      small
                      dark
                      :color="`#${label.color}`"
                      :class="{ 'ml-2': labelIndex > 0 }"
                    >
                      {{ label.name }}
                    </v-chip>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                  class="d-flex justify-end justify-sm-space-around align-center"
                >
                  <v-avatar
                    v-if="issue.assignees.length > 0"
                    size="32"
                    color="primary"
                  >
                    <img :src="getGravatarUrl(issue.assignees[0].email)" />
                  </v-avatar>
                  <v-icon v-if="issue.numOfComments > 0" size="30" class="ml-2">
                    mdi-comment-processing
                  </v-icon>
                </v-col>
              </v-row>
            </v-list-item>
          </template>
        </template>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { GetProject as Project, GetProjectLabel as Label, GetProjectIssue as Issue, GetUser as User } from '@/api/dto'
import IssueStatus from '@/enums/IssueStatus'
import { getGravatarUrl } from '@/utils/util'

interface IssueInfo {
  id: number
  title: string,
  number: number,
  status: IssueStatus
  owner: User,
  assignees: User[],
  labels: Label[],
  createdTime: Date
}

@Component
export default class IssueList extends Vue {
  @Prop() issueInfos!: IssueInfo[]
  currentTab = 'issue-open'

  getGravatarUrl (email: string) {
    return getGravatarUrl(email)
  }

  goToIssue (issueId: number) {
    this.$router.push({
      name: 'issue',
      params: {
        issueId: `${issueId}`
      }
    })
  }

  get numOfOpenIssues () {
    return this.issueInfos.filter(issueInfo => issueInfo.status === IssueStatus.Open).length
  }

  get numOfClosedIssues () {
    return this.issueInfos.filter(issueInfo => issueInfo.status === IssueStatus.Closed).length
  }

  get issuesFiltered () {
    const filteredBy = this.currentTab === 'issue-open' ? IssueStatus.Open : IssueStatus.Closed
    return this.issueInfos.filter(issueInfo => issueInfo.status === filteredBy)
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/mixins/breakpoints";
@import "@/styles/shared/util";
</style>
