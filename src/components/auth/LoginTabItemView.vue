<template>
  <v-container class="pa-6">
    <div class="text-center grey--text lighten-3">
      <v-icon color="grey-lighten-3" size="64">mdi-login</v-icon>
      <p style="font-size: 36px;">Login Now</p>
    </div>
    <v-form>
      <v-text-field
        v-model="value.username"
        id="username"
        class="plain-text mb-3"
        label="Username"
        hide-details
        outlined
        prepend-inner-icon="mdi-account"
        :error="isUsernameError"
      ></v-text-field>
      <v-text-field
        v-model="value.password"
        id="password"
        class="plain-text mb-3"
        :class="{ 'cipher-text': isPasswordHidden }"
        label="Password"
        hide-details
        outlined
        prepend-inner-icon="mdi-lock"
        :append-icon="isPasswordHidden ? 'mdi-eye' : 'mdi-eye-off'"
        :type="isPasswordHidden ? 'password' : 'text'"
        @click:append="isPasswordHidden = !isPasswordHidden"
        :error="isPasswordError"
      ></v-text-field>
      <v-checkbox
        v-model="value.keepLogin"
        class="mb-3"
        color="accent"
        label="Remember Me"
        hide-details
      ></v-checkbox>
      <ul class="error-message-list error--text pb-3 pl-1">
        <li
          v-for="(errorMessage, index) in errorMessages"
          :key="`login-error-message-${index}`"
        >
          {{ errorMessage }}
        </li>
      </ul>
      <v-btn color="primary" block>Login</v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Model } from 'vue-property-decorator'

export interface ErrorModel {
  fields: string[]
  messages: string[]
}

export interface ViewModel {
  username: string
  password: string
  keepLogin: boolean
  error: ErrorModel
}

@Component
export default class LoginTabItemView extends Vue {
  @Model() value!: ViewModel

  isPasswordHidden: boolean = true

  get isUsernameError () {
    return this.value.error.fields.includes('username')
  }

  get isPasswordError () {
    return this.value.error.fields.includes('password')
  }

  get errorMessages () {
    return this.value.error.messages
  }
}
</script>

<style lang="scss" scoped>
.plain-text {
  &::v-deep input {
    letter-spacing: 2px;
  }
}

.cipher-text {
  &::v-deep input {
    letter-spacing: 8px;
  }
}

.error-message-list::v-deep {
  li::before {
    font-size: 14px;
    font-weight: 200;
    content: "x";
  }

  li {
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
