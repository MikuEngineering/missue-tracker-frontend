<template>
  <v-app>
    <AlertGroup></AlertGroup>
    <router-view></router-view>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import AlertGroup from '@/components/shared/AlertGroup.vue'

@Component({
  components: {
    AlertGroup
  }
})
export default class App extends Vue {

}
</script>
