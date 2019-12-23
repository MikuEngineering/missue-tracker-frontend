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
              @keypress.enter="stopAddingTag(true)"
              @blur="stopAddingTag(false)"
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
        <div>Project Privacy</div>
        <p>
          <v-switch
            v-model="privacyBoolean"
            class="pa-0 mt-1"
            color="primary"
            :label="
              `The project would be ${privacyBoolean ? 'Private' : 'Public'}`
            "
            dense
            hide-details
            inset
          >
          </v-switch>
        </p>
        <p class="text-right">
          <v-btn
            :block="$vuetify.breakpoint.xs"
            large
            color="success"
            @click="createProject"
            :loading="isCreating"
          >
            <span>Create</span>
          </v-btn>
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit } from 'vue-property-decorator'
import AppModule from '@/store/modules/app'
import Api, { ApiError, BadRequestResponse, OtherClientErrorResponse } from '@/api/Api'
import ProjectPrivacy from '@/enums/ProjectPrivacy'
import { apiErrorHandler } from '@/utils/util'

const api = Api.getInstance()

@Component
export default class CreateProjectDialog extends Vue {
  @Prop() value!: boolean
  isAddingTag = false
  isCreating = false
  newTag = ''

  name = ''
  description = ''
  tags: string[] = []
  privacyBoolean = false

  get project () {
    return {
      name: this.name,
      description: this.description,
      tags: this.tags,
      privacy: this.privacy
    }
  }

  get privacy () {
    return this.privacyBoolean ? ProjectPrivacy.Private : ProjectPrivacy.Public
  }

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

  stopAddingTag (withoutBreak: boolean) {
    this.tags = [...new Set([...this.tags, this.newTag.trim()])].filter(tag => !!tag)
    this.newTag = ''
    if (withoutBreak) return
    this.isAddingTag = false
  }

  @Emit()
  createdProject () {}

  async createProject () {
    try {
      this.isCreating = true
      await api.createProject(this.project)
      this.showingDialog = false
      AppModule.addAlert({ type: 'success', message: 'Project Created Successfully' })
    } catch (error) {
      apiErrorHandler(error)
    }
    this.isCreating = false
    this.createdProject()
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
