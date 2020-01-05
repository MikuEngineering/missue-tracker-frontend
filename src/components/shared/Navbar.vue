<template>
  <v-app-bar app elevate-on-scroll>
    <!-- Go Home -->
    <v-toolbar-items>
      <v-btn text color="primary" elevation="0" @click="goToHomePage">
        <span class="missue-title">MissueTracker</span>
      </v-btn>
    </v-toolbar-items>

    <!-- Search -->
    <SearchField
      v-if="showSearchFieldInToolbarExtensionSlot"
      v-model="toSearch"
      slot="extension"
    ></SearchField>
    <SearchField v-else v-model="toSearch" class="ml-3"></SearchField>

    <v-spacer></v-spacer>

    <!-- Go Auth -->
    <v-btn v-if="isGuest" color="primary" elevation="0" @click="goToAuthPage">
      <span class="hidden-sm-and-down">Login / Register</span>
      <span class="hidden-md-and-up">
        <v-icon>mdi-login</v-icon>
        <span> | </span>
        <v-icon>mdi-account-plus</v-icon>
      </span>
    </v-btn>

    <!-- Avatar -->
    <v-toolbar-items v-else>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="transparent" v-on="on" elevation="0" x-small>
            <v-avatar size="36" color="primary" class="white--text">
              <img :src="avatarUrl" :alt="nickname" />
            </v-avatar>
            <v-icon color="primary">mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list min-width="200" elevation="0" dense>
          <v-list-item @click="goToProfilePage">
            <v-list-item-title class="text-center">
              <span>Hi, </span>
              <span class="title primary--text">{{ nickname }}</span>
            </v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import AppModule from '@/store/modules/app'
import SearchField from '@/components/shared/SearchField.vue'

@Component({
  components: {
    SearchField
  }
})
export default class Navbar extends Vue {
  toSearch: string = ''

  get avatarUrl () {
    return AppModule.gravatarImgUrl
  }

  get nickname () {
    if (AppModule.user === null) return ''
    return AppModule.user.nickname
  }

  get username () {
    if (AppModule.user === null) return ''
    return AppModule.user.username
  }

  get isGuest () {
    return !AppModule.isLoggedIn
  }

  get showSearchFieldInToolbarExtensionSlot () {
    return this.$vuetify.breakpoint.xsOnly
  }

  goToAuthPage () {
    this.$router.push({ name: 'auth' }).catch(() => {})
  }

  goToHomePage () {
    this.$router.push({ name: 'home' }).catch(() => {})
  }

  goToProfilePage () {
    this.$router.push({ name: 'profile', params: { username: this.username } }).catch(() => {})
  }

  async logout () {
    await AppModule.logout()
    this.goToHomePage()
  }
}
</script>

<style lang="scss" scoped>
.missue-title::v-deep {
  font-size: 1.2rem;
  text-transform: none !important;
}
</style>
