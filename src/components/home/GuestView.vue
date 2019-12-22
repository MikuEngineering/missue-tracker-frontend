<template>
  <v-container
    class="view-container background__linear-gradient d-flex justify-center align-center"
    fluid
  >
    <div>Why<br />don't<br />you<br />just<br />join<br />us<br />?</div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class GuestView extends Vue {

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

.view-container {
  height: 100%;
  text-align: center;
  font-size: 30vw;
  color: white;
  text-shadow: $text-shadow;
}
</style>
