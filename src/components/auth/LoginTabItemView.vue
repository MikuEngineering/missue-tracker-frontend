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
        @input="onInputUsername"
        @blur="value.startValidateUsername = true"
        :disabled="value.isDataTransferring"
        @keypress.enter="isUnableToLogin || clickLogin()"
      ></v-text-field>
      <v-text-field
        v-model="value.password"
        id="password"
        class="plain-text mb-3"
        :class="{ 'cipher-text': value.isPasswordHidden }"
        label="Password"
        hide-details
        outlined
        prepend-inner-icon="mdi-lock"
        :append-icon="value.isPasswordHidden ? 'mdi-eye' : 'mdi-eye-off'"
        :type="value.isPasswordHidden ? 'password' : 'text'"
        @click:append="value.isPasswordHidden = !value.isPasswordHidden"
        :error="isPasswordError"
        @input="onInputPassword"
        @blur="value.startValidatePassword = true"
        :disabled="value.isDataTransferring"
        @keypress.enter="isUnableToLogin || clickLogin()"
      ></v-text-field>
      <v-checkbox
        v-model="value.keepLogin"
        class="mb-3"
        color="accent"
        label="Remember Me"
        hide-details
        :disabled="value.isDataTransferring"
      ></v-checkbox>
      <ul class="error-message-list error--text pb-3 pl-1">
        <li
          v-for="(errorMessage, index) in errorMessages"
          :key="`login-error-message-${index}`"
        >
          {{ errorMessage }}
        </li>
      </ul>
      <v-btn
        @click="clickLogin"
        color="primary"
        block
        :disabled="isUnableToLogin"
      >
        Login
      </v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Model, Emit } from 'vue-property-decorator'
import { ValidationFailure, validateLoginForm } from '@/utils/validator'

export interface ViewModel {
  username: string,
  password: string,
  keepLogin: boolean,
  failures: ValidationFailure[],
  isDataTransferring: boolean,
  isPasswordHidden: boolean,
  startValidateUsername: boolean,
  startValidatePassword: boolean,
}

@Component
export default class LoginTabItemView extends Vue {
  @Model() value!: ViewModel

  get localFailures () {
    const { username, password } = this.value
    return validateLoginForm({ username, password })
      .filter(failure => failure.field !== 'username' || (this.value.startValidateUsername && failure.field === 'username'))
      .filter(failure => failure.field !== 'password' || (this.value.startValidatePassword && failure.field === 'password'))
  }

  get failures () {
    return [...this.value.failures, ...this.localFailures]
  }

  get isUsernameError () {
    return this.failures.filter(failure => failure.field === 'username').length > 0
  }

  get isPasswordError () {
    return this.failures.filter(failure => failure.field === 'password').length > 0
  }

  get errorMessages () {
    return [...new Set(this.failures.map(failure => failure.message).filter(message => !!message))]
  }

  get isUnableToLogin () {
    return this.value.isDataTransferring || this.failures.length > 0 || !this.value.username || !this.value.password
  }

  resetFieldFailures (field: string) {
    this.value.failures = this.value.failures.filter(failure => failure.field !== field)
  }

  onInputUsername () {
    this.value.startValidateUsername = true
    this.resetFieldFailures('username')
  }

  onInputPassword () {
    this.value.startValidatePassword = true
    this.resetFieldFailures('password')
  }

  @Emit()
  clickLogin () {}
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
