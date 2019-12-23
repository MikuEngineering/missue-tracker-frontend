<template>
  <v-dialog v-model="showingDialog" max-width="600">
    <v-card class="fill-parent">
      <v-card-title>
        <span class="display-1">Create Project</span>
      </v-card-title>
      <v-card-text class="mt-3">
        <div>Project Name</div>
        <p style="max-width: 250px;">
          <v-text-field
            v-model="name"
            outlined
            hide-details
            dense
          ></v-text-field>
        </p>
        <div>Project Tags</div>
        <p class="tag-field">
          <v-chip
            v-for="(tag, index) in tags"
            :key="`create-project-tag-${index}`"
            class="mr-2 mt-2"
            label
            outlined
            close
            color="primary"
            @click:close="removeTag(tag)"
          >
            {{ tag }}
          </v-chip>
          <v-chip
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
              @keypress.enter="stopAddingTag"
              @blur="stopAddingTag"
            />
            <v-icon v-else>mdi-plus</v-icon>
          </v-chip>
        </p>
        <div>Project Description</div>
        <p>
          <v-textarea
            v-model="description"
            outlined
            no-resize
            hide-details
          ></v-textarea>
        </p>
        <v-btn v-if="$vuetify.breakpoint.xs" block large color="success">
          <span>Create</span>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import AppModule from '@/store/modules/app'

@Component
export default class CreateProjectDialog extends Vue {
  @Prop() value!: boolean
  isAddingTag = false
  newTag = ''

  name = ''
  description = ''
  tags: string[] = []

  get showingDialog () {
    return this.value
  }
  set showingDialog (value:boolean) {
    if (!value) {
      this.name = ''
      this.description = ''
      this.tags = []
    }
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

  stopAddingTag () {
    this.tags = [...new Set([...this.tags, this.newTag.trim()])].filter(tag => !!tag)
    this.newTag = ''
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
