<template>
  <v-container fluid class="view-container pa-0">
    <div class="background__header primary">Miku</div>
    <v-container class="py-0">
      <v-row class="project-list mx-auto">
        <v-col class="project-list__header" cols="12">
          <div class="header__title">All Projects</div>
          <div class="header__amount">{{ numOfProjects }} projects</div>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <ProjectCard @click="openCreateProjectDialog">
            <AddProjectCardContent></AddProjectCardContent>
          </ProjectCard>
        </v-col>
        <v-col
          v-for="(project, index) in projects"
          :key="`project-card-${index}`"
          cols="12"
          sm="6"
          md="4"
        >
          <v-fade-transition hide-on-leave>
            <ProjectCard>
              <v-skeleton-loader
                max-height="100%"
                :loading="project === null"
                transition="fade-transition"
                type="article"
              >
                <ProjectInfoCardContent
                  v-bind="project"
                  @click-project="goToProjectPage"
                  @click-tag="goToTagSearchPage"
                ></ProjectInfoCardContent>
              </v-skeleton-loader>
            </ProjectCard>
          </v-fade-transition>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import ProjectCard from '@/components/home/ProjectCard.vue'
import AddProjectCardContent from '@/components/home/AddProjectCardContent.vue'
import ProjectInfoCardContent from '@/components/home/ProjectInfoCardContent.vue'
import AppModule from '@/store/modules/app'
import { GetProject as Project } from '@/api/dto'
import api from '../../api/api'

interface ProjectInfo extends Project {
  ownerUsername: string
}

@Component({
  components: {
    ProjectCard,
    AddProjectCardContent,
    ProjectInfoCardContent
  }
})
export default class ProjectListView extends Vue {
  @Prop() projectIds!: number[]

  isLoadingProjects = true
  _projectInfos: ProjectInfo[] = []

  get projects () {
    return this.projectIds.map((projectId, index) => this.isLoadingProjects ? null : this._projectInfos[index])
  }

  get numOfProjects () {
    return this.projectIds.length
  }

  @Emit()
  openCreateProjectDialog () {}

  goToProjectPage (params: { username: string, projectName: string }) {
    this.$router.push({
      name: 'project',
      params
    })
  }

  goToTagSearchPage (tag: string) {
  }

  @Watch('numOfProjects')
  onNumOfProjectsChanged () {
    this.updateProjects()
  }

  async updateProjects () {
    AppModule.setIsPageLoading(true)
    this.isLoadingProjects = true
    try {
      const projects = await Promise.all(this.projectIds.map(projectId => api.getProject(projectId)))
      this._projectInfos = await Promise.all(projects.map(async project => {
        const { username: ownerUsername } = await api.getUserById(project.ownerId)
        const projectInfo: ProjectInfo = {
          ...project,
          ownerUsername
        }
        return projectInfo
      }))
    } catch (error) {
    }
    this.isLoadingProjects = false
    AppModule.setIsPageLoading(false)
  }

  created () {
    this.updateProjects()
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/mixins/breakpoints.scss";
$text-shadow: 0.1rem 0.1rem 0.2rem rgb(0, 0, 0, 0.5);

.background__linear-gradient {
  background: #578ba1 !important;
  background: linear-gradient(
    90deg,
    #70bcdb 0%,
    #b8deec 50%,
    #d3eefc 100%
  ) !important;
}

.view-container {
  $header-height: 250px;
  $header-height--xs: 200px;
  position: relative;

  :not(.background__header) {
    z-index: 1;
  }

  .background__header {
    z-index: 0;
    position: absolute;
    width: 100%;
    height: $header-height;
    color: rgb(255, 255, 255, 0.1);
    text-align: center;
    font-size: 10rem;
    line-height: $header-height;
    user-select: none;

    @include xs {
      height: $header-height--xs;
      font-size: 7rem;
      line-height: $header-height--xs;
    }
  }

  .project-list {
    $padding-vertical: 50px;
    $padding-vertical--xs: 30px;
    padding-top: $padding-vertical;
    padding-bottom: $padding-vertical;

    @include mdAndUp {
      max-width: 900px;
    }

    @include smOnly {
      max-width: 600px;
    }

    @include xs {
      padding-top: $padding-vertical--xs;
    }

    &__header {
      padding-bottom: $padding-vertical;
      color: white;

      @include xs {
        padding-bottom: $padding-vertical--xs;
      }

      .header__title {
        font-size: 2.5rem;
        font-weight: 600;
      }

      .header__amount {
        font-size: 1.2rem;
        font-weight: 300;
      }
    }
  }
}
</style>
