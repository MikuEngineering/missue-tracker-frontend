<template>
  <v-dialog v-model="showingDialog" max-width="350">
    <v-card>
      <v-card-text class="title text-center pa-3">
        <span>Label Management</span>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-tabs v-model="currentMode" show-arrows fixed-tabs icons-and-text>
          <v-tab :disabled="loading">
            <span class="d-xs-none ml-1">Edit</span>
            <v-icon>mdi-pencil</v-icon>
          </v-tab>
          <v-tab :disabled="loading">
            <span class="d-xs-none ml-1">Add</span>
            <v-icon>mdi-plus</v-icon>
          </v-tab>
          <v-tab :disabled="loading">
            <span class="d-xs-none ml-1">Remove</span>
            <v-icon>mdi-delete</v-icon>
          </v-tab>
        </v-tabs>
      </v-card-actions>
      <v-card-text class="mt-3">
        <v-overlay absolute :value="loading" color="white" opacity="1">
          <v-progress-circular
            color="primary"
            indeterminate
          ></v-progress-circular>
        </v-overlay>
        <v-container v-if="isEditMode" class="pa-0">
          <p>
            <v-tooltip
              v-for="(label, index) in previewLabels"
              :key="`label-${index}`"
              top
            >
              <template v-slot:activator="{ on }">
                <v-badge
                  :value="selectedIndex === index"
                  color="warning"
                  overlap
                >
                  <template v-slot:badge>
                    <v-icon dark>mdi-pencil</v-icon>
                  </template>
                  <v-chip
                    dark
                    :color="`#${label.color}`"
                    v-on="on"
                    :class="{ 'ml-2': index > 0 }"
                    @click="selectLabelToEdit(index)"
                  >
                    {{ label.name }}
                  </v-chip>
                </v-badge>
              </template>
              <span>{{ label.description }}</span>
            </v-tooltip>
          </p>
          <LabelEditor
            v-if="selectedIndex !== null"
            v-model="labelModel"
          ></LabelEditor>
          <v-btn color="primary" block @click="action">Edit</v-btn>
        </v-container>
        <v-container v-else-if="isAddMode" class="pa-0">
          <LabelEditor v-model="labelModel"></LabelEditor>
          <v-btn color="success" block @click="action">Add</v-btn>
        </v-container>
        <v-container v-else class="pa-0">
          <p>
            <v-tooltip
              v-for="(label, index) in labels"
              :key="`label-${index}`"
              top
            >
              <template v-slot:activator="{ on }">
                <v-badge
                  :value="selectedIndex === index"
                  color="primary"
                  overlap
                >
                  <template v-slot:badge>
                    <v-icon dark>mdi-check</v-icon>
                  </template>
                  <v-chip
                    dark
                    :color="`#${label.color}`"
                    v-on="on"
                    :class="{ 'ml-2': index > 0 }"
                    @click="selectLabelToEdit(index)"
                  >
                    {{ label.name }}
                  </v-chip>
                </v-badge>
              </template>
              <span>{{ label.description }}</span>
            </v-tooltip>
          </p>
          <v-btn color="error" @click="action" block>Remove</v-btn>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Emit, Watch } from 'vue-property-decorator'
import AppModule from '@/store/modules/app'
import { GetProjectLabel as Label } from '@/api/dto'
import Api from '@/api/Api'
import { apiErrorHandler } from '@/utils/util'
import LabelEditor from '@/components/project/LabelEditor.vue'

const api = Api.getInstance()

interface LabelInfo extends Label {
  id: number
}

enum Mode {
  Edit,
  Add,
  Remove
}

@Component({
  components: {
    LabelEditor
  }
})
export default class LabelEditDialog extends Vue {
  @Prop() value!: boolean
  @Prop() labels!: LabelInfo[]
  @Prop() projectId!: number
  loading: boolean = false
  selectedIndex: number | null = null
  currentMode: Mode = Mode.Edit
  labelModel: { name: string, description: string, color: string } = {
    name: '',
    description: '',
    color: '#000000'
  }

  get showingDialog () {
    return this.value
  }

  set showingDialog (value:boolean) {
    this.$emit('input', value)
  }

  get previewLabels () {
    if (this.selectedIndex === null) return this.labels
    return this.labels.map((label, index) => {
      if (index === this.selectedIndex) {
        return { ...label, ...this.labelModel }
      }
      return label
    })
  }

  get isEditMode () {
    return this.currentMode === Mode.Edit
  }

  get isAddMode () {
    return this.currentMode === Mode.Add
  }

  get isRemoveMode () {
    return this.currentMode === Mode.Remove
  }

  selectLabelToEdit (index: number) {
    this.selectedIndex = index
    this.initLabelModel()
  }

  initLabelModel () {
    this.labelModel = {
      name: '',
      description: '',
      color: '#000000'
    }
    if (this.selectedIndex === null) return
    const selectedLabel = this.labels[this.selectedIndex]
    this.labelModel = {
      name: selectedLabel.name,
      description: selectedLabel.description,
      color: selectedLabel.color
    }
  }

  async action () {
    if (this.isEditMode) {
      if (this.selectedIndex === null) return
      this.loading = true
      try {
        await api.updateProjectLabel({
          labelId: this.labels[this.selectedIndex].id,
          ...this.labelModel
        })
        this.actionDone()
      } catch (error) {
        apiErrorHandler(error)
      }
      this.loading = false
    } else if (this.isAddMode) {
      this.loading = true
      try {
        await api.createProjectLabel({
          projectId: this.projectId,
          ...this.labelModel
        })
        this.actionDone()
      } catch (error) {
        apiErrorHandler(error)
      }
      this.loading = false
    } else {
      if (this.selectedIndex === null) return
      this.loading = true
      try {
        await api.deleteProjectLabel(this.labels[this.selectedIndex].id)
        this.actionDone()
      } catch (error) {
        apiErrorHandler(error)
      }
      this.loading = false
    }
  }

  @Emit()
  actionDone () {}

  @Watch('showingDialog')
  onToggleDialog () {
    this.selectedIndex = null
    this.initLabelModel()
  }

  @Watch('currentMode')
  onSwitchMode () {
    this.selectedIndex = null
    this.initLabelModel()
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/shared/util";
</style>
