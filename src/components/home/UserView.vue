<template>
  <div class="fill-height">
    <ProjectEmptyView v-if="isEmpty && !isLoadingProjectIds"></ProjectEmptyView>
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
import { delay } from '@/utils/util'

async function mockGetProjectIds () {
  await delay(300)
  return [1, 2, 3, 4, 5, 6, 7]
  // return []
}

@Component({
  components: {
    ProjectEmptyView,
    ProjectListView
  }
})
export default class HomeView extends Vue {
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
