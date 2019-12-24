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
import Api, { ApiError, BadRequestResponse, OtherClientErrorResponse } from '@/api/Api'
import ProjectPrivacy from '@/enums/ProjectPrivacy'
import { apiErrorHandler } from '@/utils/util'
import TagField from './TagField.vue'

const api = Api.getInstance()

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
export default class ProjectEditorDialog extends Vue {
  @Prop() value!: boolean
  @Prop() project!: Project
  @Prop() mode!: string
  @Prop() id!: number
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

  async createProject () {
    try {
      this.loading = true
      await api.createProject(this.projectModel)
      AppModule.addAlert({ type: 'success', message: 'Project Created Successfully' })
      this.actionDone()
    } catch (error) {
      apiErrorHandler(error)
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
      this.actionDone()
    } catch (error) {
      apiErrorHandler(error)
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
  actionDone () {
    this.initProjectModel()
    this.showingDialog = false
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
