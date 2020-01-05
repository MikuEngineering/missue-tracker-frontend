<template>
  <div class="fill-height">
    <ProjectEditDialog
      v-model="showingCreateProjectDialog"
      mode="new"
      @action-done="updateProjectIds"
    >
      <v-card></v-card>
    </ProjectEditDialog>
    <ProjectEmptyView
      v-if="isEmpty && !isLoadingProjectIds"
      @open-create-project-dialog="showingCreateProjectDialog = true"
    ></ProjectEmptyView>
    <ProjectListView
      v-else-if="!isEmpty"
      :projectIds="projectIds"
      @open-create-project-dialog="showingCreateProjectDialog = true"
    ></ProjectListView>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { GetProject as Project } from '@/api/dto'
import AppModule from '@/store/modules/app'
import ProjectEmptyView from './ProjectEmptyView.vue'
import ProjectListView from './ProjectListView.vue'
import ProjectEditDialog from '../project/ProjectEditDialog.vue'
import api from '../../api/api'

@Component({
  components: {
    ProjectEmptyView,
    ProjectListView,
    ProjectEditDialog
  }
})
export default class HomeView extends Vue {
  showingCreateProjectDialog = false
  isLoadingProjectIds = true
  projectIds: number[] = []

  get isEmpty () {
    return this.numOfProjects === 0
  }

  get numOfProjects () {
    return this.projectIds.length
  }

  async updateProjectIds () {
    const user = AppModule.user
    if (user === null) return
    const id = user.id
    AppModule.setIsPageLoading(true)
    this.isLoadingProjectIds = true
    try {
      this.projectIds = await api.getUserProjectIds(id)
    } catch (error) {
    }
    this.isLoadingProjectIds = false
    AppModule.setIsPageLoading(false)
  }

  created () {
    this.updateProjectIds()
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/util";
</style>
