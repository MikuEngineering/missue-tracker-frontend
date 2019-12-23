<template>
  <div class="fill-height">
    <CreateProjectDialog
      v-model="showingCreateProjectDialog"
      @created-project="updateProjectIds"
    >
      <v-card></v-card>
    </CreateProjectDialog>
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
import { app as AppModule, user as UserModule } from '@/store/modules/'
import ProjectEmptyView from './ProjectEmptyView.vue'
import ProjectListView from './ProjectListView.vue'
import CreateProjectDialog from './CreateProjectDialog.vue'
import { mockGetProjectIds, apiErrorHandler } from '@/utils/util'
import Api from '../../api/Api'

const api = Api.getInstance()

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
    const id = UserModule.id
    if (id === null) return
    AppModule.setIsPageLoading(true)
    this.isLoadingProjectIds = true
    try {
      this.projectIds = await api.getUserProjectIds(id)
    } catch (error) {
      apiErrorHandler(error)
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
