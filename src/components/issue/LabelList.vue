<template>
  <v-list-group prepend-icon="mdi-tag" value="true">
    <template v-slot:activator>
      <v-list-item-title>Labels</v-list-item-title>
    </template>

    <v-list-item-group v-model="selectedIndexes" multiple>
      <v-list-item
        v-for="(label, index) in labels"
        :key="`label-list-item-${index}`"
      >
        <v-list-item-icon>
          <v-chip dark :color="`#${label.color}`">
            <span>{{ label.name }}</span>
          </v-chip>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ label.name }}
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
import { GetProjectLabel as Label } from '@/api/dto'
import { getGravatarUrl } from '@/utils/util'

interface LabelInfo extends Label {
  id: number
}

@Component
export default class LabelList extends Vue {
  @Prop() value!: number[]
  @Prop() labels!: LabelInfo[]

  get selectedIndexes () {
    return this.value
  }

  set selectedIndexes (value) {
    this.$emit('input', value)
  }
}
</script>

<style lang="scss" scoped>
</style>
