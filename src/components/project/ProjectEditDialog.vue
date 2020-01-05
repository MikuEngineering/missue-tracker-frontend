<template>
  <v-dialog v-model="showingDialog" max-width="600">
    <v-card class="fill-parent">
      <v-card-title>
        <span class="display-1">{{ text }} Project</span>
      </v-card-title>
      <v-card-text class="mt-3">
        <div>Project Name</div>
        <p style="max-width: 250px;">
          <v-text-field
            v-model="projectModel.name"
            outlined
            hide-details
            dense
          ></v-text-field>
        </p>
        <div>Project Tags</div>
        <TagField v-model="projectModel.tags"></TagField>
        <div>Project Description</div>
        <p>
          <v-textarea
            v-model="projectModel.description"
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
            v-if="deletable"
            :block="$vuetify.breakpoint.xs"
            class="mr-2"
            large
            color="error"
            @click="clickDelete"
            :loading="loading"
          >
            <span>Delete</span>
          </v-btn>
          <v-btn
            :block="$vuetify.breakpoint.xs"
            large
            color="success"
            @click="clickDone"
            :loading="loading"
          >
            <span>{{ text }}</span>
          </v-btn>
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, PropSync, Emit, Watch } from 'vue-property-decorator'
import AppModule from '@/store/modules/app'
import api, { BadRequestResponse, OtherClientErrorResponse } from '@/api/api'
import ProjectPrivacy from '@/enums/ProjectPrivacy'
import TagField from './TagField.vue'

interface Project {
  name: string,
  description: string,
  tags: string[]
  privacy: ProjectPrivacy
}

@Component({
  components: {
    TagField
  }
})
export default class ProjectEditDialog extends Vue {
  @Prop() value!: boolean
  @Prop() project!: Project
  @Prop() mode!: string
  @Prop() id!: number
  @Prop() deletable!: boolean
  loading: boolean = false
  projectModel: Project = {
    name: '',
    description: '',
    tags: [],
    privacy: ProjectPrivacy.Public
  }

  get showingDialog () {
    return this.value
  }

  set showingDialog (value:boolean) {
    this.$emit('input', value)
  }

  get text () {
    return this.mode === 'new' ? 'Create' : 'Edit'
  }

  get privacyBoolean () {
    return this.projectModel.privacy === ProjectPrivacy.Private
  }
  set privacyBoolean (value: boolean) {
    this.projectModel.privacy = value ? ProjectPrivacy.Private : ProjectPrivacy.Public
  }

  async clickDelete () {
    try {
      this.loading = true
      await api.deleteProject(this.id)
      AppModule.addAlert({ type: 'success', message: 'Project Created Successfully' })
      this.$router.push('/')
      this.showingDialog = false
    } catch (error) {
    }
    this.loading = false
  }

  async createProject () {
    try {
      this.loading = true
      await api.createProject(this.projectModel)
      AppModule.addAlert({ type: 'success', message: 'Project Created Successfully' })
      this.initProjectModel()
      this.showingDialog = false
      this.actionDone()
    } catch (error) {
    }
    this.loading = false
  }

  async editProject () {
    try {
      this.loading = true
      await api.updateProject({
        projectId: this.id,
        ...this.projectModel
      })
      AppModule.addAlert({ type: 'success', message: 'Project Updated Successfully' })
      if (this.project.name !== this.projectModel.name) {
        this.changeProjectName(this.projectModel.name)
      } else {
        this.actionDone()
      }
      this.initProjectModel()
      this.showingDialog = false
    } catch (error) {
    }
    this.loading = false
  }

  initProjectModel () {
    this.projectModel = {
      name: '',
      description: '',
      tags: [],
      privacy: ProjectPrivacy.Public
    }
    if (this.project) {
      this.projectModel = JSON.parse(JSON.stringify(this.project))
    }
  }

  clickDone () {
    this.mode === 'new' ? this.createProject() : this.editProject()
  }

  @Emit()
  actionDone () {}

  @Emit()
  changeProjectName (projectName: string) {
    this.showingDialog = false
    return projectName
  }

  @Watch('showingDialog')
  onToggleDialog () {
    this.initProjectModel()
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/util";
</style>
