<template>
  <div class="fill-height">
    <CreateProjectDialog v-model="showingCreateProjectDialog">
      <v-card></v-card>
    </CreateProjectDialog>
    <ProjectEmptyView
      v-if="isEmpty && !isLoadingProjectIds"
      @open-create-project-dialog="showingCreateProjectDialog = true"
    ></ProjectEmptyView>
    <ProjectListView
      v-else-if="!isEmpty"
      :projectIds="projectIds"
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
import CreateProjectDialog from './CreateProjectDialog.vue'
import { mockGetProjectIds } from '@/utils/util'

@Component({
  components: {
    ProjectEmptyView,
    ProjectListView,
    CreateProjectDialog
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
    AppModule.setIsPageLoading(true)
    this.isLoadingProjectIds = true
    this.projectIds = await mockGetProjectIds()
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
