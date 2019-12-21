<template>
  <div class="auth-card">
    <v-card>
      <v-tabs v-model="value.currentTab" grow>
        <v-tab href="#tab-login">Login</v-tab>
        <v-tab href="#tab-register">Register</v-tab>
        <v-tab-item value="tab-login">
          <LoginTabItemView
            v-model="value.loginViewModel"
            @click-login="clickLogin"
          ></LoginTabItemView
        ></v-tab-item>
        <v-tab-item value="tab-register">
          <RegisterTabItemView
            v-model="value.registerViewModel"
            @click-register="clickRegister"
          ></RegisterTabItemView
        ></v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Model, Emit } from 'vue-property-decorator'
import LoginTabItemView, { ViewModel as LoginViewModel } from './LoginTabItemView.vue'
import RegisterTabItemView, { ViewModel as RegisterViewModel } from './RegisterTabItemView.vue'

export interface ViewModel {
  currentTab: string,
  tabDisabled: boolean,
  loginViewModel: LoginViewModel
  registerViewModel: RegisterViewModel
}

@Component({
  components: {
    LoginTabItemView,
    RegisterTabItemView
  }
})
export default class AuthCard extends Vue {
  @Model() value!: ViewModel

  @Emit()
  clickLogin () {}

  @Emit()
  clickRegister () {}
}
</script>

<style lang="scss" scoped>
.auth-card {
  max-width: 400px;
}
</style>
