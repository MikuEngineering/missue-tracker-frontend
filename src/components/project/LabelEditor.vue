<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col cols="12" sm="6" class="py-1">
        <v-text-field
          v-model="label.name"
          outlined
          hide-details
          dense
          label="Name"
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="py-1">
        <v-textarea
          v-model="label.description"
          outlined
          hide-details
          rows="5"
          auto-grow
          no-resize
          label="Description"
        ></v-textarea>
      </v-col>
      <v-col class="d-none d-sm-block pa-0" cols="12" sm="4"></v-col>
      <v-col cols="12" class="py-1">
        <div>Color</div>
        <div class="d-flex justify-center">
          <v-color-picker
            class="color-picker"
            v-model="color"
            hide-mode-switch
            hide-inputs
            flat
            mode="hexa"
          ></v-color-picker>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { GetProjectLabel as Label } from '@/api/dto'

@Component
export default class LabelEditor extends Vue {
  @Prop() value!: Label

  get label () {
    return this.value
  }

  set label (value) {
    this.value = value
  }

  get color () {
    return `#${this.label.color.replace('#', '')}`
  }

  set color (value) {
    this.label.color = value.replace('#', '').slice(0, 6)
  }
}
</script>

<style lang="scss" scoped>
.color-picker {
  &::v-deep .v-color-picker__hue {
    margin: 0 !important;
  }

  &::v-deep .v-color-picker__alpha {
    display: none !important;
  }
}
</style>
