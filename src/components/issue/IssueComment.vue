<template>
  <v-row>
    <v-col
      cols="12"
      sm="2"
      class="d-flex flex-column align-start align-sm-center"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-avatar
            v-on="on"
            tile
            size="56"
            @click="goToUserProfile(owner.username)"
          >
            <img :src="getGravatarUrl(owner.email)" />
          </v-avatar>
        </template>
        <span>{{ owner.nickname }}</span>
      </v-tooltip>
    </v-col>
    <v-col cols="12" sm="10">
      <v-textarea
        v-if="isEditting"
        v-model="content"
        solo
        hide-details
        auto-grow
        no-resize
        rows="10"
        label="Comment"
      ></v-textarea>
      <v-card v-else class="pa-5">
        <div
          v-for="(line, i) in contentLines"
          :key="`comment-content-line-${i}`"
          v-text="line"
        ></div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { GetUser as User } from '@/api/dto'
import { getGravatarUrl } from '@/utils/util'

interface UserInfo extends User {
  id: number
}

@Component
export default class IssueComment extends Vue {
  @Prop() value!: string
  @Prop() isEditting!: boolean
  @Prop() owner!: UserInfo

  get content () {
    return this.value
  }

  set content (value) {
    this.$emit('input', value)
  }

  get contentLines () {
    return this.value.trim().split('\n').map(line => line.trim())
  }

  getGravatarUrl (email: string) {
    return getGravatarUrl(email)
  }

  goToUserProfile (username: string) {
    this.$router.push({
      name: 'profile',
      params: {
        username
      }
    })
  }
}
</script>
