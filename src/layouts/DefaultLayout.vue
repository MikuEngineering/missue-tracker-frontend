<template>
  <v-app>
    <v-app-bar app></v-app-bar>
    <v-container fluid class="d-flex pa-0" style="height: 100%;">
      <v-content>
        <slot></slot>
      </v-content>
    </v-container>
    <v-footer app dark>
      <v-spacer></v-spacer>
      <span class="grey--text lighten-3">Miku Engineering © 2019</span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class DefaultLayout extends Vue {

}
</script>

<style lang="scss" scoped>
</style>
