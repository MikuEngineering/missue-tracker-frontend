<template>
  <DefaultLayout>
    <v-progress-linear v-if="isPageLoading" indeterminate></v-progress-linear>
    <AlertGroup></AlertGroup>
    <router-view></router-view>
  </DefaultLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AlertGroup from '@/components/shared/AlertGroup.vue'
import AppModule from '@/store/modules/app'

@Component({
  components: {
    DefaultLayout,
    AlertGroup
  }
})
export default class App extends Vue {
  get isPageLoading () {
    return AppModule.isPageLoading
  }
}
</script>
