<template>
  <GuestView v-if="isGuest"></GuestView>
  <UserView v-else></UserView>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import GuestView from '@/components/home/GuestView.vue'
import UserView from '@/components/home/UserView.vue'
import UserModule from '@/store/modules/user'

@Component({
  components: {
    GuestView,
    UserView
  }
})
export default class HomeView extends Vue {
  get isGuest () {
    return !UserModule.isLoggedIn
  }
}
</script>

<style lang="scss" scoped>
</style>
