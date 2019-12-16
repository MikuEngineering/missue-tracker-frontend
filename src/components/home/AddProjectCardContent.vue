<template>
  <div class="content d-flex flex-column justify-center align-center">
    <v-icon class="warning--text" size="80">mdi-plus</v-icon>
    <span class="title warning--text">Create Project</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Emit } from 'vue-property-decorator'

@Component
export default class AddProjectCardContent extends Vue {
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
}
</style>
