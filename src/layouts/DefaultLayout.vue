<template>
  <v-app>
    <Navbar></Navbar>
    <v-container fluid class="fill-height pa-0">
      <v-content class="fill-height">
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
import Navbar from '@/components/shared/Navbar.vue'

@Component({
  components: {
    Navbar
  }
})
export default class DefaultLayout extends Vue {
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/util";
</style>
