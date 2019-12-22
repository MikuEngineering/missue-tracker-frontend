<template>
  <v-container
    class="auth-view__container background__linear-gradient d-flex align-center"
    fluid
    style="height: 100%;"
  >
    <v-content>
      <v-row no-gutters align="center">
        <v-col class="d-flex" cols="12" md="7">
          <div class="missue-info mx-auto">
            <p class="missue-info__title">{{ title }}</p>
            <p class="missue-info__introduction">
              {{ introduction }}
            </p>
          </div>
        </v-col>
        <v-col class="d-flex d-md-block justify-center" cols="12" md="5">
          <AuthCard
            v-model="authCardViewModel"
            v-if="$vuetify.breakpoint.mdAndUp"
            class="mx-auto"
            @click-login="onClickedLogin"
            @click-register="onClickedRegister"
          ></AuthCard>
          <v-dialog v-else v-model="isAuthDialogVisible" max-width="400">
            <template v-slot:activator="{ on }">
              <v-btn color="secondary" dark v-on="on">
                Login / Register
              </v-btn>
            </template>

            <AuthCard
              v-model="authCardViewModel"
              @click-login="onClickedLogin"
              @click-register="onClickedRegister"
            ></AuthCard>
          </v-dialog>
        </v-col>
      </v-row>
    </v-content>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import AuthCard, { ViewModel as AuthCardViewModel } from '@/components/auth/AuthCard.vue'
import { Component, Watch } from 'vue-property-decorator'
import { app as AppModule, user as UserModule } from '@/store/modules'
import { ApiError, BadRequestResponse, OtherClientErrorResponse } from '../api/Api'
import ErrorCode from '../enums/ErrorCode'

function generateLoginViewModel () {
  return {
    username: '',
    password: '',
    keepLogin: false,
    failures: [],
    isDataTransferring: false,
    isPasswordHidden: true,
    startValidateUsername: false,
    startValidatePassword: false
  }
}

function generateRegisterViewModel () {
  return {
    username: '',
    password: '',
    passwordConfirm: '',
    failures: [],
    isDataTransferring: false,
    isPasswordHidden: true,
    isPasswordConfirmHidden: true,
    startValidateUsername: false,
    startValidatePassword: false,
    startValidatePasswordConfirm: false
  }
}

@Component({
  components: {
    AuthCard
  }
})
export default class AuthView extends Vue {
  readonly title: string = 'Missue Tracker';
  readonly introduction: string =
    'An issue tracker platform inspired by the way you work. From open source to business, you can host and manage projects, and discuss issues.';
  isAuthDialogVisible: boolean = false;

  authCardViewModel: AuthCardViewModel = {
    currentTab: 'tab-login',
    tabDisabled: false,
    loginViewModel: generateLoginViewModel(),
    registerViewModel: generateRegisterViewModel()
  }

  get registerViewModel () {
    return this.authCardViewModel.registerViewModel
  }

  get loginViewModel () {
    return this.authCardViewModel.loginViewModel
  }

  @Watch('$vuetify.breakpoint.mdAndUp')
  onBreakpointMdAndUpTriggered (value: boolean, oldValue: boolean) {
    if (value) {
      this.isAuthDialogVisible = false
    }
  }

  async onClickedLogin () {
    try {
      const { username, password, keepLogin: isKeepLogin } = this.loginViewModel
      this.loginViewModel.isDataTransferring = true
      await UserModule.login({ username, password, isKeepLogin })
      this.$router.push({ name: 'home' })
      this.authCardViewModel.loginViewModel = generateLoginViewModel()
    } catch (error) {
      this.loginViewModel.isDataTransferring = false
      if (!(error instanceof ApiError)) throw error
      const apiError: ApiError = error

      if (apiError.code === ErrorCode.BadRequest) {
        const data: BadRequestResponse = apiError.data
        this.loginViewModel.failures = data.errors.map(e => {
          return {
            field: e.field,
            message: e.message
          }
        })
      } else {
        const data: OtherClientErrorResponse = apiError.data
        const fields = ['username', 'password']
        this.loginViewModel.failures = fields.map(field => ({
          field,
          message: data.message
        }))
        AppModule.addAlert({ type: 'error', message: data.message })
      }
    }
  }

  async onClickedRegister () {
    try {
      const { username, password } = this.registerViewModel
      this.registerViewModel.isDataTransferring = true
      await UserModule.register({ username, password })
      this.authCardViewModel.currentTab = 'tab-login'
      this.authCardViewModel.registerViewModel = generateRegisterViewModel()
    } catch (error) {
      this.registerViewModel.isDataTransferring = false
      if (!(error instanceof ApiError)) throw error
      const apiError: ApiError = error

      if (apiError.code === ErrorCode.BadRequest) {
        const data: BadRequestResponse = apiError.data
        this.registerViewModel.failures = data.errors.map(e => {
          return {
            field: e.field,
            message: e.message
          }
        })
      } else {
        const data: OtherClientErrorResponse = apiError.data
        const fields = ['username', 'password', 'passwordConfirm']
        this.registerViewModel.failures = fields.map(field => ({
          field,
          message: data.message
        }))
        AppModule.addAlert({ type: 'error', message: data.message })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/mixins/breakpoints.scss";
$text-shadow: 0.1rem 0.1rem 0.2rem rgb(0, 0, 0, 0.5);

.background__linear-gradient {
  background: #578ba1 !important;
  background: linear-gradient(
    90deg,
    #70bcdb 0%,
    #b8deec 50%,
    #d3eefc 100%
  ) !important;
}

.auth-view__container {
  @include smAndUp {
    padding: 0 48px;
  }
}

.missue-info {
  display: inline-block;

  &__title {
    line-height: 1;
    color: white;
    text-shadow: $text-shadow;
  }

  &__introduction {
    line-height: 1.5;
    color: white;
    text-shadow: $text-shadow;
  }

  @include smAndDown {
    text-align: center;

    &__title {
      padding-bottom: 2rem;
      font-size: 3rem;
    }

    &__introduction {
      padding-bottom: 2rem;
      max-width: 28rem;
      font-size: 1.2rem;
    }
  }

  @include mdAndUp {
    &__title {
      font-size: 4rem;
    }

    &__introduction {
      max-width: 28rem;
      font-size: 1.5rem;
    }
  }

  @include lgAndUp {
    &__title {
      font-size: 6rem;
    }

    &__introduction {
      max-width: 40rem;
      font-size: 1.8rem;
    }
  }
}
</style>
