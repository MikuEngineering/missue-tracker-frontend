<template>
  <v-progress-linear
    v-if="isLoadingProjectIds"
    indeterminate
  ></v-progress-linear>
  <div v-else style="height: 100%;">
    <ProjectEmptyView v-if="isEmpty"></ProjectEmptyView>
    <ProjectListView v-else :projectIds="projectIds"></ProjectListView>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { GetProject as Project } from '@/api/dto'
import ProjectEmptyView from './ProjectEmptyView.vue'
import ProjectListView from './ProjectListView.vue'

function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function mockGetProjectIds () {
  await delay(300)
  // return [1, 2, 3, 4, 5, 6, 7]
  return []
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
    this.isLoadingProjectIds = true
    this.projectIds = await mockGetProjectIds()
    this.isLoadingProjectIds = false
  }

  created () {
    this.updateProjectIds()
  }
}
</script>

<style>
</style>
