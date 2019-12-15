<template>
  <v-app class="background__linear-gradient">
    <v-container
      class="auth-view__container d-flex align-center"
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
            ></AuthCard>
            <v-dialog v-else v-model="isAuthDialogVisible" max-width="400">
              <template v-slot:activator="{ on }">
                <v-btn color="secondary" dark v-on="on">
                  Login / Register
                </v-btn>
              </template>

              <AuthCard v-model="authCardViewModel"></AuthCard>
            </v-dialog>
          </v-col>
        </v-row>
      </v-content>
    </v-container>

    <v-footer color="transparent">
      <v-spacer></v-spacer>
      <span class="grey--text lighten-3">Miku Engineering © 2019</span>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import AuthCard, { ViewModel as AuthCardViewModel } from '@/components/auth/AuthCard.vue'
import { Component, Watch } from 'vue-property-decorator'

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
    loginViewModel: {
      username: '',
      password: '',
      keepLogin: false,
      error: {
        fields: [],
        messages: []
      }
    },
    registerViewModel: {
      username: '',
      password: '',
      passwordConfirm: '',
      error: {
        fields: [],
        messages: []
      }
    }
  }

  @Watch('$vuetify.breakpoint.mdAndUp')
  onBreakpointMdAndUpTriggered (val: boolean, oldVal: boolean) {
    if (val) {
      this.isAuthDialogVisible = false
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
    #f3fbff 100%
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
