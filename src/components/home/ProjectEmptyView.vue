<template>
  <v-container
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
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class ProjectEmptyView extends Vue {
  goToCreateProjectPage () {
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
</style>
