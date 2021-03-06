<template>
  <v-container class="view-container">
    <v-overlay absolute :value="loading" color="white" opacity="0.5">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </v-overlay>
    <v-row>
      <v-col cols="12" sm="8">
        <p class="display-1">Create Issue</p>
        <p>
          <v-text-field
            v-model="title"
            label="Title"
            outlined
            hide-details
            dense
          ></v-text-field>
        </p>
        <p>
          <IssueComment
            v-model="content"
            :owner="owner"
            :is-editting="true"
          ></IssueComment>
        </p>
        <p class="d-flex">
          <v-spacer></v-spacer>
          <v-btn
            :block="$vuetify.breakpoint.xs"
            color="success"
            @click="createIssue"
          >
            Create
          </v-btn>
        </p>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="pa-3" max-height="300">
          <AssigneeList
            v-model="selectedMemberIndexes"
            :members="members"
          ></AssigneeList>
        </v-card>
        <div class="py-1"></div>
        <v-card class="pa-3" max-height="300">
          <LabelList
            v-model="selectedLabelIndexes"
            :labels="labels"
          ></LabelList>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import api from '@/api/api'
import { Route } from 'vue-router'
import { GetUser as User, GetProjectLabel as Label } from '@/api/dto'
import AppModule from '@/store/modules/app'
import AssigneeList from '@/components/issue/AssigneeList.vue'
import LabelList from '@/components/issue/LabelList.vue'
import IssueComment from '@/components/issue/IssueComment.vue'

interface Member extends User {
  id: number
}

interface LabelInfo extends Label {
  id: number
}

@Component({
  components: {
    AssigneeList,
    LabelList,
    IssueComment
  }
})
export default class CreateIssueView extends Vue {
  title = ''
  content = ''

  loading: boolean = false

  selectedMemberIndexes: number[] = []
  selectedLabelIndexes: number[] = []

  members: Member[] = []
  labels: LabelInfo[] = []

  get meta () {
    return {
      ownerUsername: this.$route.params.username,
      projectName: this.$route.params.projectName
    }
  }

  get selectedMemberIds () {
    return this.selectedMemberIndexes.map(index => this.members[index].id)
  }

  get selectedLabelIds () {
    return this.selectedLabelIndexes.map(index => this.labels[index].id)
  }

  get owner () {
    return AppModule.user
  }

  async createIssue () {
    this.loading = true
    try {
      const projectId = await api.getProjectId(this.meta)
      await api.createProjectIssue({
        projectId,
        title: this.title,
        comment: {
          content: this.content
        },
        labels: this.selectedLabelIds,
        assignees: this.selectedMemberIds
      })

      this.$router.replace({
        name: 'project',
        params: this.$route.params
      })
    } catch (error) {
    }
    this.loading = false
  }

  async beforeRouteEnter (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    try {
      const projectId = await api.getProjectId({
        ownerUsername: to.params.username,
        projectName: to.params.projectName
      })
      const memberIds = await api.getProjectMemberIds(projectId)
      const members = (await Promise.all(memberIds.map(id => api.getUserById(id))))
        .map((member, index) => ({ ...member, id: memberIds[index] }))

      const labelIds = await api.getProjectLabelIds(projectId)
      const labels = (await Promise.all(labelIds.map(id => api.getProjectLabel(id))))
        .map((label, index) => ({ ...label, id: labelIds[index] }))
      await next((vm: CreateIssueView) => {
        vm.members = members
        vm.labels = labels
      })
      AppModule.setIsPageLoading(false)
    } catch (error) {
      await next()
      AppModule.setIsPageLoading(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.view-container {
  max-width: 900px;
}
</style>
