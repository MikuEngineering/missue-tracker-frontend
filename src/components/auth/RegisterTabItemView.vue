<template>
  <v-container class="pa-6">
    <div class="text-center grey--text lighten-3">
      <v-icon color="grey-lighten-3" size="64">mdi-account-plus</v-icon>
      <p style="font-size: 36px;">Join Now</p>
    </div>
    <v-form>
      <v-text-field
        id="username"
        class="plain-text mb-3"
        label="Username"
        hide-details
        outlined
        prepend-inner-icon="mdi-account"
        :error="isUsernameError"
      ></v-text-field>
      <v-text-field
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
      <v-text-field
        id="password-confirm"
        class="plain-text mb-3"
        :class="{ 'cipher-text': isPasswordConfirmHidden }"
        label="Password Confirm"
        hide-details
        outlined
        prepend-inner-icon="mdi-lock"
        :append-icon="isPasswordConfirmHidden ? 'mdi-eye' : 'mdi-eye-off'"
        :type="isPasswordConfirmHidden ? 'password' : 'text'"
        @click:append="isPasswordConfirmHidden = !isPasswordConfirmHidden"
        :error="isPasswordConfirmError"
      ></v-text-field>
      <ul class="error-message-list error--text pb-3 pl-1">
        <li
          v-for="(errorMessage, index) in errorMessages"
          :key="`register-error-message-${index}`"
        >
          {{ errorMessage }}
        </li>
      </ul>
      <v-btn color="primary" block>Register</v-btn>
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
  passwordConfirm: string
  error: ErrorModel
}

@Component
export default class RegisterTabItemView extends Vue {
  @Model() value!: ViewModel

  isPasswordHidden: boolean = true
  isPasswordConfirmHidden: boolean = true

  get isUsernameError () {
    return this.value.error.fields.includes('username')
  }

  get isPasswordError () {
    return this.value.error.fields.includes('password')
  }

  get isPasswordConfirmError () {
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
