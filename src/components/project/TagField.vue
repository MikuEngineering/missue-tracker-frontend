<template>
  <p>
    <v-chip
      v-for="(tag, index) in tags"
      :key="`create-project-tag-${index}`"
      class="mr-2 mt-2"
      label
      outlined
      :close="!readonly"
      color="primary"
      @click:close="removeTag(tag)"
    >
      {{ tag }}
    </v-chip>
    <v-chip
      v-if="!readonly"
      label
      outlined
      color="primary"
      class="mt-2"
      @click="startAddingTag"
    >
      <input
        id="tag-input"
        v-model="newTag"
        v-if="isAddingTag"
        class="primary--text"
        @keypress.enter="stopAddingTag(true)"
        @blur="stopAddingTag(false)"
      />
      <v-icon v-else>mdi-plus</v-icon>
    </v-chip>
  </p>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class CreateProjectDialog extends Vue {
  @Prop() readonly!: boolean
  @Prop() value!: string[]
  isAddingTag = false
  newTag = ''
  get tags () {
    return this.value
  }
  set tags (value) {
    this.$emit('input', value)
  }

  async startAddingTag () {
    this.isAddingTag = true
    await this.$nextTick()
    const tagInput = document.getElementById('tag-input')
    if (tagInput === null) return
    tagInput.focus()
  }

  removeTag (tag: string) {
    this.tags.splice(this.tags.indexOf(tag))
  }

  stopAddingTag (withoutBreak: boolean) {
    this.tags = [...new Set([...this.tags, this.newTag.trim()])].filter(tag => !!tag)
    this.newTag = ''
    if (withoutBreak) return
    this.isAddingTag = false
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/util";

#tag-input {
  width: 64px;
  outline: 0;
}
</style>
