<template>
  <v-list-group prepend-icon="mdi-account" value="true">
    <template v-slot:activator>
      <v-list-item-title>Assignees</v-list-item-title>
    </template>

    <v-list-item-group v-model="selectedIndexes" multiple>
      <v-list-item
        v-for="(member, index) in members"
        :key="`member-list-item-${index}`"
      >
        <v-list-item-avatar>
          <img :src="getGravatarUrl(member.email)" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ member.nickname }}
          </v-list-item-title>
        </v-list-item-content>
        <v-list-item-icon v-if="selectedIndexes.includes(index)">
          <v-icon color="primary">mdi-check</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list-item-group>
  </v-list-group>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { GetUser as User, GetProjectLabel as Label } from '@/api/dto'
import { getGravatarUrl } from '@/utils/util'

interface Member extends User {
  id: number
}

interface LabelInfo extends Label {
  id: number
}

@Component
export default class AssigneeList extends Vue {
  @Prop() value!: number[]
  @Prop() members!: Member[]

  get selectedIndexes () {
    return this.value
  }

  set selectedIndexes (value) {
    this.$emit('input', value)
  }

  getGravatarUrl (email: string) {
    return getGravatarUrl(email)
  }
}
</script>

<style lang="scss" scoped>
</style>
