<template>
  <v-dialog v-model="showingDialog" max-width="400">
    <v-card>
      <v-card-text class="title text-center pa-3">
        <span>Member Management</span>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-tabs v-model="currentMode" show-arrows fixed-tabs icons-and-text>
          <v-tab :disabled="loading">
            <span class="d-xs-none ml-1">Overview</span>
            <v-icon>mdi-eye</v-icon>
          </v-tab>
          <v-tab :disabled="loading">
            <span class="d-xs-none ml-1">Transfer</span>
            <v-icon>mdi-swap-horizontal</v-icon>
          </v-tab>
          <v-tab :disabled="loading">
            <span class="d-xs-none ml-1">Add</span>
            <v-icon>mdi-plus</v-icon>
          </v-tab>
          <v-tab :disabled="loading">
            <span class="d-xs-none ml-1">Remove</span>
            <v-icon>mdi-delete</v-icon>
          </v-tab>
        </v-tabs>
      </v-card-actions>
      <v-card-text class="mt-3">
        <v-overlay absolute :value="loading" color="white" opacity="1">
          <v-progress-circular
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-overlay>
        <div v-if="isAddMode" class="text-end">
          <v-text-field
            v-model="toAddUsername"
            class="mb-3"
            label="Username"
            dense
            hide-details
            outlined
          ></v-text-field>
          <v-btn
            :loading="loading"
            :block="$vuetify.breakpoint.xs"
            color="success"
            elevation="0"
            @click="action(toAddUsername)"
          >
            Add
          </v-btn>
        </div>
        <div
          v-else-if="filteredMembers.length === 0"
          class="text-center py-3 headline grey--text text--lighten-1"
        >
          No members
        </div>
        <v-list v-else>
          <v-list-item
            v-for="(member, index) in filteredMembers"
            :key="`member-${index}`"
            two-line
            @click="action(member.username)"
          >
            <v-list-item-avatar size="56">
              <img :src="getGravatarUrl(member.email)" />
            </v-list-item-avatar>
            <v-list-item-title>
              <v-chip
                v-if="owner === member.id"
                dark
                color="error"
                x-small
                class="mb-2"
              >
                Owner
              </v-chip>
              <div>{{ member.nickname }}</div>
              <div class="body-2 grey--text">{{ member.username }}</div>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import AppModule from '@/store/modules/app'
import { GetUser as User } from '@/api/dto'
import Api from '@/api/Api'
import { apiErrorHandler, getGravatarUrl } from '@/utils/util'

const api = Api.getInstance()

interface Member extends User {
  id: number
}

enum Mode {
  Overview,
  Transfer,
  Add,
  Remove
}

@Component
export default class MemberEditDialog extends Vue {
  @Prop() value!: boolean
  @Prop() members!: Member[]
  @Prop() projectId!: number
  @Prop() owner!: number
  toAddUsername: string = ''
  loading: boolean = false
  currentMode: Mode = Mode.Overview

  get showingDialog () {
    return this.value
  }

  set showingDialog (value:boolean) {
    this.$emit('input', value)
  }

  get filteredMembers () {
    const filters = {
      [Mode.Overview]: (member: Member) => true,
      [Mode.Transfer]: (member: Member) => member.id !== this.owner,
      [Mode.Add]: (member: Member) => false,
      [Mode.Remove]: (member: Member) => member.id !== this.owner
    }
    return this.members.filter(filters[this.currentMode])
  }

  get isAddMode () {
    return Mode.Add === this.currentMode
  }

  getGravatarUrl (email: string) {
    return getGravatarUrl(email)
  }

  async action (username: string) {
    if (this.currentMode === Mode.Overview) {
      await this.$router.push({
        name: 'profile',
        params: {
          username
        }
      }).catch(() => {})
    } else {
      this.loading = true
      try {
        const userId = await api.getUserIdByUsername(username)
        const projectId = this.projectId
        const actions = {
          [Mode.Transfer]: async () => {
            await api.transferProjectOwner({ newOwnerId: userId, projectId })
            this.transferProject(username)
          },
          [Mode.Add]: async () => {
            await api.addUserToProjectMembers({ userId, projectId })
            this.actionDone()
          },
          [Mode.Remove]: async () => {
            await api.deleteUserFromProjectMembers({ userId, projectId })
            this.actionDone()
          }
        }
        await actions[this.currentMode]()
      } catch (error) {
        apiErrorHandler(error)
      }
      this.loading = false
    }
  }

  @Emit()
  actionDone () {}

  @Emit()
  transferProject (username: string) {
    return username
  }

  @Watch('showingDialog')
  onToggleDialog () {
    this.toAddUsername = ''
    this.currentMode = Mode.Overview
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/util";
</style>
