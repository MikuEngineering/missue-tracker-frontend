<template>
  <DefaultLayout>
    <AlertGroup></AlertGroup>
    <router-view></router-view>
  </DefaultLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AlertGroup from '@/components/shared/AlertGroup.vue'

@Component({
  components: {
    DefaultLayout,
    AlertGroup
  }
})
export default class App extends Vue {

}
</script>
