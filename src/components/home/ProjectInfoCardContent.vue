<template>
  <div class="fill-parent project-content pa-5 d-flex flex-column">
    <div class="project-click-aria pb-3" @click="clickProject">
      <div class="project-content__title">
        <span style="vertical-align: middle;">{{ name }}</span>
      </div>
      <div class="d-flex align-center">
        <span class="project-content__created-date">
          {{ createdDateString }}
        </span>
        <v-chip
          v-if="privacy === 1"
          x-small
          label
          outlined
          class="project-content__privacy-tag ml-3"
          color="grey lighten-1"
          text-color="grey lighten-1"
        >
          <span>Private</span>
        </v-chip>
      </div>
      <div class="project-content__description mt-5">
        <span>{{ description }}</span>
      </div>
    </div>
    <div class="project-content__tags mt-auto ml-n1" @click.prevent="() => {}">
      <v-chip
        v-for="(tag, index) in tags"
        :key="`project-${name}-tag-${index}`"
        small
        label
        outlined
        color="primary"
        @click="clickTag(tag)"
        ><v-icon class="pr-1" size="12">mdi-tag</v-icon
        ><span>{{ tag }}</span></v-chip
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'

@Component
export default class ProjectInfoCardContent extends Vue {
  @Prop() name!: string
  @Prop() createdDate!: string
  @Prop() description!: string
  @Prop() privacy!: number
  @Prop() tags!: string[]

  get createdDateString () {
    let splited = new Date(this.createdDate).toDateString().split(' ')
    splited.shift()
    return `${splited[1]} ${splited[0]}, ${splited[2]}`
  }

  @Emit()
  clickProject () {
    return this.name
  }

  @Emit()
  clickTag (tag: string) {}
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/util";
@mixin no-scrollbar {
  &::-webkit-scrollbar {
    display: none;
  }

  & {
    -ms-overflow-style: none;
  }
}

.project-content {
  .project-click-aria {
    cursor: pointer;

    &:hover .project-content__title {
      color: var(--v-primary-base);
    }
  }

  &__title {
    font-size: 28px;
    font-weight: 500;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 1;
    color: #3a3a3a;
  }

  &__created-date {
    font-size: 14px;
    font-weight: 500;
    color: #7e7e7e;
  }

  &__description {
    height: 40px;
    line-height: 20px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    color: #c1c1c1;
  }

  &__tags {
    max-height: 30px;
    line-height: 30px;
    vertical-align: middle;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;

    @include no-scrollbar;

    & > * {
      margin-left: 4px;
    }
  }
}
</style>
