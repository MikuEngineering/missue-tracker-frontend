<template>
  <v-container class="fill-height"></v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

@Component
export default class ProfileView extends Vue {
  get username () {
    return this.$route.params.username
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/util";
</style>
