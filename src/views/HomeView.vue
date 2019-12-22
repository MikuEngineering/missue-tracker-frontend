<template>
  <DefaultLayout>
    <v-container
      v-if="numOfProjects === 0"
      fluid
      class="view-container--empty d-flex justify-center align-center background__linear-gradient pa-0"
    >
      <div class="background__welcome d-flex">
        <div class="welcome d-flex flex-column justify-center align-start">
          <p class="welcome__title">Welcome,</p>
          <p class="welcome__subtitle">Create your first awesome project！</p>
          <div>
            <v-btn
              class="mt-6"
              large
              color="primary--text"
              @click="goToCreateProjectPage"
            >
              Create Now
            </v-btn>
          </div>
        </div>
        <div class="image-container">
          <img
            class="image"
            :src="`${require('@/assets/images/home_welcome_background.svg')}`"
          />
        </div>
      </div>
    </v-container>
    <v-container v-else fluid class="view-container pa-0">
      <div class="background__header primary">Miku</div>
      <v-container class="py-0">
        <v-row class="project-list mx-auto">
          <v-col class="project-list__header" cols="12">
            <div class="header__title">All Projects</div>
            <div class="header__amount">101 projects</div>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <ProjectCard @click="goToCreateProjectPage">
              <AddProjectCardContent></AddProjectCardContent>
            </ProjectCard>
          </v-col>
          <v-col
            v-for="(project, index) in viewModel.projects"
            :key="`project-card-${index}`"
            cols="12"
            sm="6"
            md="4"
          >
            <ProjectCard>
              <ProjectInfoCardContent
                v-bind="project"
                @click-project="goToProjectPage"
                @click-tag="goToTagSearchPage"
              ></ProjectInfoCardContent>
            </ProjectCard>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </DefaultLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ProjectCard from '@/components/home/ProjectCard.vue'
import AddProjectCardContent from '@/components/home/AddProjectCardContent.vue'
import ProjectInfoCardContent from '@/components/home/ProjectInfoCardContent.vue'
import UserModule from '@/store/modules/user'
import { GetProject as Project } from '@/api/dto'

function delay (ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function mockGetProjectIds () {
  await delay(100)
  return [1, 2, 3, 4, 5, 6, 7]
}

async function mockGetProjectInfo (projectId: number) {
  await delay(200)
  return {
    name: `project-${projectId}`,
    createdDate: new Date().toJSON(),
    description: `A missue-tracker project-${projectId}.`,
    privacy: Math.floor(Math.random() * 2),
    tags: ['typescript', 'vue', 'scss']
  }
}

export interface ViewModel {
  isLoadingProjectIds: boolean,
  isLoadingProjects: boolean,
  projectIds: number[],
  projects: Project[]
}

@Component({
  components: {
    DefaultLayout,
    ProjectCard,
    AddProjectCardContent,
    ProjectInfoCardContent
  }
})
export default class HomeView extends Vue {
  viewModel: ViewModel = {
    isLoadingProjectIds: true,
    isLoadingProjects: true,
    projectIds: [],
    projects: []
  }

  get isGuest () {
    return !UserModule.isLoggedIn
  }

  get numOfProjects () {
    return this.viewModel.projectIds
  }

  goToCreateProjectPage () {
  }

  goToProjectPage (projectName: string) {
  }

  goToTagSearchPage (tag: string) {
  }

  async mounted () {
    if (this.isGuest) return
    this.viewModel.projectIds = await mockGetProjectIds()
    this.viewModel.isLoadingProjectIds = false
    const promises = this.viewModel.projectIds.map(projectId => mockGetProjectInfo(projectId))
    console.log(promises)
    this.viewModel.projects = await Promise.all(promises)
    this.viewModel.isLoadingProjects = false
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
    #f3fbff 100%
  ) !important;
}

.view-container--empty {
  height: 100%;

  .background__welcome {
    position: relative;

    .welcome {
      z-index: 1;
      .welcome__title,
      .welcome__subtitle {
        text-shadow: $text-shadow;
        margin: 0;
        margin-bottom: 16px;
        color: white;
        line-height: 1;
      }
    }

    .image-container {
      z-index: 0;
      .image {
        width: 100%;
        height: auto;
        object-fit: contain;
      }
    }

    @include mdAndUp {
      display: flex;
      max-width: 75%;

      .welcome {
        width: 34%;

        .welcome__title,
        .welcome__subtitle {
          white-space: nowrap;
        }

        .welcome__title {
          font-size: 7rem;
        }

        .welcome__subtitle {
          font-size: 2rem;
        }
      }

      .image-container {
        width: 66%;
      }
    }

    @include smAndDown {
      height: 100%;
      .welcome {
        width: 100%;
        text-align: center;
        padding-bottom: 30%;

        & > * {
          width: 100%;
        }
        .welcome__title {
          font-size: 6rem;
        }

        .welcome__subtitle {
          $padding-horizontal: 20px;
          padding-left: $padding-horizontal;
          padding-right: $padding-horizontal;
          line-height: 1.2;
          font-size: 2rem;
        }
      }

      .image-container {
        position: absolute;
        bottom: 0;
      }
    }

    @include xs {
      .welcome {
        .welcome__title {
          font-size: 4rem;
        }

        .welcome__subtitle {
          font-size: 1.5rem;
        }
      }
    }
  }
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
