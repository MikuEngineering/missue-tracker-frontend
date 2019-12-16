<template>
  <v-card class="project-card" v-on="$listeners">
    <slot></slot>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class ProjectCard extends Vue {
}
</script>

<style lang="scss" scoped>
.project-card {
  width: 280px;
  height: 200px;
  margin: auto;
}
</style>
