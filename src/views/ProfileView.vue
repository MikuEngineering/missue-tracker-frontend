<template>
  <v-container
    class="view-container fill-height d-flex justify-center align-center"
  >
    <div
      v-if="isUserNotFound"
      class="display-3 grey--text lighten-3 text-center"
    >
      User Not Found
    </div>
    <v-card
      v-else
      class="profile-card fill-parent pa-12"
      :class="{ 'px-3': $vuetify.breakpoint.xs }"
    >
      <div
        class="d-flex flex-wrap justify-center justify-sm-start align-center"
      >
        <div class="d-flex flex-column align-center py-2">
          <v-avatar
            :size="$vuetify.breakpoint.smAndUp ? 128 : 192"
            color="primary"
          >
            <img :src="userAvatarUrl" />
          </v-avatar>
          <v-btn
            v-if="isSelf"
            class="mt-3"
            :color="`${isEditting ? 'success' : 'primary'}`"
            outlined
            rounded
            small
            elevation="0"
            :loading="isSavingProfile"
            @click="toggleEdit"
            >{{ isEditting ? "Done" : "Edit" }}</v-btn
          >
        </div>
        <div v-if="isEditting" class="px-3" style="width: 70%;">
          <v-text-field
            v-model="editedProfile.nickname"
            class="mb-2"
            v-if="isEditting"
            label="Nickname"
            dense
            outlined
            hide-details
            :disabled="isSavingProfile"
          ></v-text-field>

          <v-text-field
            v-model="editedProfile.email"
            class="mb-2"
            label="Email"
            dense
            outlined
            hide-details
            :disabled="isSavingProfile"
          ></v-text-field>

          <v-text-field
            v-model="editedProfile.lineToken"
            class="mb-2"
            label="Line Token"
            dense
            outlined
            hide-details
            :disabled="isSavingProfile"
          ></v-text-field>

          <v-textarea
            v-model="editedProfile.autobiography"
            class="mb-2"
            v-if="isEditting"
            label="Autobiography"
            auto-grow
            no-resize
            outlined
            hide-details
            rows="1"
            :disabled="isSavingProfile"
          ></v-textarea>
        </div>
        <div
          v-else
          class="d-flex flex-column justify-center align-center align-sm-start"
          :class="`px-${$vuetify.breakpoint.xs ? 0 : 8}`"
        >
          <div
            class="display-1 text-center d-flex flex-wrap flex-column flex-sm-row justify-center align-center"
          >
            <span class="text-truncate" style="max-width: 220px;">
              {{ user.nickname }}
            </span>
            <v-chip
              v-if="user && user.lineToken && !isEditting"
              class="d-xs-block d-inline mx-2"
              color="success"
            >
              Line Notification
            </v-chip>

            <v-chip
              v-if="isAdmin && !isEditting"
              class="d-xs-block d-inline mx-2"
              color="warning"
            >
              Admin
            </v-chip>
          </div>
          <div v-if="!isEditting" class="headline grey--text lighten-3">
            {{ user.username }}
          </div>
          <div class="pt-2">
            <a :href="`mailto:${user.email}`" style="text-decoration: none;">
              {{ user.email }}
            </a>
          </div>
          <div class="pt-2">
            <div
              class="subtitle-1 grey--text lighten-5 text-center text-sm-start"
            >
              {{ user.autobiography }}
            </div>
          </div>
        </div>
      </div>
      <v-divider class="mt-3 pt-3"></v-divider>
      <v-row>
        <v-col></v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import md5 from 'js-md5'
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { Route } from 'vue-router'
import api from '../api/api'
import { getGravatarUrl } from '@/utils/util'
import AppModule from '@/store/modules/app'
import UserStatus from '@/enums/UserStatus'
import User from '../interfaces/User'

@Component
export default class ProfileView extends Vue {
  isEditting = false
  isSavingProfile = false
  user: User | null = null
  editedProfile: { nickname: string, email: string, autobiography: string, lineToken: string } = {
    nickname: '',
    email: '',
    autobiography: '',
    lineToken: ''
  }

  get isUserNotFound () {
    return this.user === null
  }

  get isSelf () {
    if (this.user === null || AppModule.user === null) return false
    return AppModule.user.id === this.user.id
  }

  get isAdmin () {
    return AppModule.isAdmin
  }

  get usernameUri () {
    return this.$route.params.username
  }

  get userAvatarUrl () {
    if (this.user === null) return ''
    return getGravatarUrl(this.user.email, 300)
  }

  async toggleEdit () {
    if (this.user === null) return

    if (this.isEditting) {
      this.isSavingProfile = true
      try {
        await api.updateUser({
          userId: this.user.id,
          ...this.editedProfile
        })
        await AppModule.afterLoggedIn(this.user.username)
        this.user.nickname = this.editedProfile.nickname
        this.user.email = this.editedProfile.email
        this.user.lineToken = this.editedProfile.lineToken
        this.user.autobiography = this.editedProfile.autobiography
        this.isEditting = false
      } catch (error) {
      }
      this.isSavingProfile = false
    } else {
      this.editedProfile = {
        nickname: this.user.nickname,
        email: this.user.email,
        autobiography: this.user.autobiography,
        lineToken: this.user.lineToken
      }
      this.isEditting = true
    }
  }

  async beforeRouteEnter (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    const targetUsername = to.params.username
    try {
      const targetUser = await api.getUserByUsername(targetUsername).catch(() => null)
      next((vm: ProfileView) => {
        vm.user = targetUser
      })
    } catch (error) {
      next()
    }
    AppModule.setIsPageLoading(false)
  }

  async beforeRouteUpdate (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    const targetUsername = to.params.username
    try {
      const targetUser = await api.getUserByUsername(targetUsername).catch(() => null)
      this.user = targetUser
      next()
    } catch (error) {
      next()
    }
    AppModule.setIsPageLoading(false)
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/mixins/breakpoints";
@import "@/styles/shared/util";

.view-container {
  max-width: 900px;

  .profile-card {
    @include smAndUp {
      max-height: 600px;
    }

    .autobiography {
      max-width: 600px;
    }
  }
}
</style>
