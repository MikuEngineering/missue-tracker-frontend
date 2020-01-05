<template>
  <div class="alert-group pt-2 px-2">
    <v-alert
      v-for="(alert, index) in alerts"
      :key="`alert-${index}`"
      :type="alert.type"
      dismissible
      close-label
      @input="removeAlert(alert)"
    >
      {{ alert.message }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import AppModule from '@/store/modules/app'
import Alert from '@/interfaces/Alert'

@Component
export default class AlertGroup extends Vue {
  get alerts () {
    return AppModule.alerts
  }

  removeAlert (alert: Alert) {
    AppModule.removeAlert(alert)
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/mixins/breakpoints.scss";

.alert-group {
  width: 400px;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 99999;

  @include xs {
    width: 100%;
  }

  .v-alert {
    margin-bottom: 8px !important;
  }
}
</style>
