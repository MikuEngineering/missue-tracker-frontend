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
            v-if="!editedProfile.lineToken"
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
              {{ profile.nickname }}
            </span>
            <v-chip
              v-if="profile && profile.lineToken && !isEditting"
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
            {{ profile.username }}
          </div>
          <div class="pt-2">
            <a :href="`mailto:${profile.email}`" style="text-decoration: none;">
              {{ profile.email }}
            </a>
          </div>
          <div class="pt-2">
            <div
              class="subtitle-1 grey--text lighten-5 text-center text-sm-start"
            >
              {{ profile.autobiography }}
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
import { GetUser as Profile } from '@/api/dto'
import { Route } from 'vue-router'
import Api, { ApiError, BadRequestResponse, OtherClientErrorResponse } from '../api/Api'
import { app as AppModule, user as UserModule } from '@/store/modules/'
import UserPermission from '@/enums/UserPermission'
import UserStatus from '@/enums/UserStatus'
import ErrorCode from '@/enums/ErrorCode'

const api = Api.getInstance()

@Component
export default class ProfileView extends Vue {
  isEditting = false
  isSavingProfile = false
  id: number | null = null
  profile: Profile | null = null
  editedProfile: { nickname: string, email: string, autobiography: string, lineToken: string } = {
    nickname: '',
    email: '',
    autobiography: '',
    lineToken: ''
  }

  get isUserNotFound () {
    return this.id === null
  }

  get isSelf () {
    return UserModule.id === this.id
  }

  get isAdmin () {
    if (this.profile === null) return false
    return this.profile.permission === UserPermission.Admin
  }

  get usernameUri () {
    return this.$route.params.username
  }

  get userAvatarUrl () {
    if (this.profile === null) return ''
    const hash = md5(this.profile.email)
    return `https://www.gravatar.com/avatar/${hash}?s=256`
  }

  async toggleEdit () {
    if (this.id === null || this.profile === null) return

    if (this.isEditting) {
      this.isSavingProfile = true
      try {
        await api.updateUser({
          userId: this.id,
          ...this.editedProfile
        })
        await UserModule.afterLoggedIn(this.profile.username)
        this.profile.nickname = this.editedProfile.nickname
        this.profile.email = this.editedProfile.email
        this.profile.autobiography = this.editedProfile.autobiography
        this.isEditting = false
      } catch (error) {
        if (!(error instanceof ApiError)) throw error
        const apiError: ApiError = error

        if (apiError.code === ErrorCode.BadRequest) {
          const data: BadRequestResponse = apiError.data
          data.errors.forEach(err => AppModule.addAlert({ type: 'error', message: err.message }))
        } else {
          const data: OtherClientErrorResponse = apiError.data
          AppModule.addAlert({ type: 'error', message: data.message })
        }
      }
      this.isSavingProfile = false
    } else {
      this.editedProfile = {
        nickname: this.profile.nickname,
        email: this.profile.email,
        autobiography: this.profile.autobiography,
        lineToken: this.profile.lineToken
      }
      this.isEditting = true
    }
  }

  async beforeRouteEnter (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    const targetUsername = to.params.username
    try {
      const targetId = await api.getUserIdByUsername(targetUsername)
      const targetProfile = await api.getUser(targetId)
      next((vm: ProfileView) => {
        vm.id = targetId
        vm.profile = targetProfile
      })
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      const apiError: ApiError = error
      const data: OtherClientErrorResponse = apiError.data
      AppModule.addAlert({ type: 'error', message: data.message })
      next()
    }
    AppModule.setIsPageLoading(false)
  }

  async beforeRouteUpdate (to: Route, from: Route, next: Function) {
    AppModule.setIsPageLoading(true)
    const targetUsername = to.params.username
    try {
      const targetId = await api.getUserIdByUsername(targetUsername)
      const targetProfile = await api.getUser(targetId)
      this.id = targetId
      this.profile = targetProfile
      next()
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
      const apiError: ApiError = error
      const data: OtherClientErrorResponse = apiError.data
      AppModule.addAlert({ type: 'error', message: data.message })
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
