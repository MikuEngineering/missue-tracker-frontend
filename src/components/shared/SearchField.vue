<template>
  <v-autocomplete
    v-model="toSearch"
    hide-details
    dense
    flat
    outlined
    light
    single-line
    label="Search"
    prepend-inner-icon="mdi-magnify"
    clearable
    @keypress.enter="$emit('search')"
  ></v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class SearchField extends Vue {
  @Prop() value!: string

  get toSearch () {
    return this.value
  }

  set toSearch (value: string) {
    this.$emit('input', value)
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/mixins/breakpoints.scss";

.v-input::v-deep {
  @include smAndUp {
    max-width: 300px;
  }
}
</style>
