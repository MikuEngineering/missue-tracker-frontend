const newModuleNames = process.argv.slice(2)
if (newModuleNames.length === 0) throw Error('You should enter the names of new modules')

const fs = require('fs')
const path = require('path')

const storeDirPath = path.join(__dirname, '../src/store/')
const storeModulesDirPath = path.join(storeDirPath, 'modules/')

newModuleNames.forEach(newModuleName => generateModule(newModuleName))
generateModulesIndex()

function generateModule (newModuleName) {
  const newModuleDirPath = path.join(storeModulesDirPath, newModuleName.toLowerCase())

  if (fs.existsSync(newModuleDirPath)) throw Error('New module directory is not empty')

  fs.mkdirSync(newModuleDirPath, { recursive: true })

  // types
  const newModuleTypesScriptPath = path.join(newModuleDirPath, 'types.ts')
  const newModuleTypesScriptLines = []
  newModuleTypesScriptLines.push(`export interface ${newModuleName}State {}`)
  newModuleTypesScriptLines.push(``)
  fs.writeFileSync(newModuleTypesScriptPath, newModuleTypesScriptLines.join('\n'))

  // state
  const newModuleStateScriptPath = path.join(newModuleDirPath, 'state.ts')
  const newModuleStateScriptLines = []
  newModuleStateScriptLines.push(`import { ${newModuleName}State } from './types'`)
  newModuleStateScriptLines.push(``)
  newModuleStateScriptLines.push(`const state: ${newModuleName}State = {}`)
  newModuleStateScriptLines.push(``)
  newModuleStateScriptLines.push(`export default state`)
  newModuleStateScriptLines.push(``)
  fs.writeFileSync(newModuleStateScriptPath, newModuleStateScriptLines.join('\n'))

  // getters
  const newModuleGettersScriptPath = path.join(newModuleDirPath, 'getters.ts')
  const newModuleGettersScriptLines = []
  newModuleGettersScriptLines.push(`import { GetterTree } from 'vuex'`)
  newModuleGettersScriptLines.push(`import { ${newModuleName}State } from './types'`)
  newModuleGettersScriptLines.push(`import { RootState } from '../../types'`)
  newModuleGettersScriptLines.push(``)
  newModuleGettersScriptLines.push(`const getters: GetterTree<${newModuleName}State, RootState> = {}`)
  newModuleGettersScriptLines.push(``)
  newModuleGettersScriptLines.push(`export default getters`)
  newModuleGettersScriptLines.push(``)
  fs.writeFileSync(newModuleGettersScriptPath, newModuleGettersScriptLines.join('\n'))

  // mutations
  const newModuleMutationsScriptPath = path.join(newModuleDirPath, 'mutations.ts')
  const newModuleMutationsScriptLines = []
  newModuleMutationsScriptLines.push(`import { MutationTree } from 'vuex'`)
  newModuleMutationsScriptLines.push(`import { ${newModuleName}State } from './types'`)
  newModuleMutationsScriptLines.push(``)
  newModuleMutationsScriptLines.push(`const mutations: MutationTree<${newModuleName}State> = {}`)
  newModuleMutationsScriptLines.push(``)
  newModuleMutationsScriptLines.push(`export default mutations`)
  newModuleMutationsScriptLines.push(``)
  fs.writeFileSync(newModuleMutationsScriptPath, newModuleMutationsScriptLines.join('\n'))

  // actions
  const newModuleActionsScriptPath = path.join(newModuleDirPath, 'actions.ts')
  const newModuleActionsScriptLines = []
  newModuleActionsScriptLines.push(`import { ActionTree } from 'vuex'`)
  newModuleActionsScriptLines.push(`import { ${newModuleName}State } from './types'`)
  newModuleActionsScriptLines.push(`import { RootState } from '../../types'`)
  newModuleActionsScriptLines.push(``)
  newModuleActionsScriptLines.push(`const actions: ActionTree<${newModuleName}State, RootState> = {}`)
  newModuleActionsScriptLines.push(``)
  newModuleActionsScriptLines.push(`export default actions`)
  newModuleActionsScriptLines.push(``)
  fs.writeFileSync(newModuleActionsScriptPath, newModuleActionsScriptLines.join('\n'))

  // module index
  const newModuleIndexScriptPath = path.join(newModuleDirPath, 'index.ts')
  const newModuleIndexScriptLines = []
  newModuleIndexScriptLines.push(`import { Module } from 'vuex'`)
  newModuleIndexScriptLines.push(`import { ${newModuleName}State } from './types'`)
  newModuleIndexScriptLines.push(`import { RootState } from '../../types'`)
  newModuleIndexScriptLines.push(`import state from './state'`)
  newModuleIndexScriptLines.push(`import getters from './getters'`)
  newModuleIndexScriptLines.push(`import mutations from './mutations'`)
  newModuleIndexScriptLines.push(`import actions from './actions'`)
  newModuleIndexScriptLines.push(`const namespaced = true`)
  newModuleIndexScriptLines.push(`const module: Module<${newModuleName}State, RootState> = {`)
  newModuleIndexScriptLines.push(`  namespaced,`)
  newModuleIndexScriptLines.push(`  state,`)
  newModuleIndexScriptLines.push(`  getters,`)
  newModuleIndexScriptLines.push(`  mutations,`)
  newModuleIndexScriptLines.push(`  actions`)
  newModuleIndexScriptLines.push(`}`)
  newModuleIndexScriptLines.push(``)
  newModuleIndexScriptLines.push(`export default module`)
  newModuleIndexScriptLines.push(``)
  fs.writeFileSync(newModuleIndexScriptPath, newModuleIndexScriptLines.join('\n'))
}

function generateModulesIndex () {
  const storeModulesIndexScriptPath = path.join(storeModulesDirPath, 'index.ts')
  const storeModuleNames = fs.readdirSync(storeModulesDirPath)
    .filter(filename => fs.statSync(path.join(storeModulesDirPath, filename)).isDirectory())
  const storeModulesIndexScriptLines = []

  storeModuleNames.forEach(moduleName => {
    storeModulesIndexScriptLines.push(`export { default as ${moduleName} } from './${moduleName}/'`)
  })

  storeModulesIndexScriptLines.push(``)
  fs.writeFileSync(storeModulesIndexScriptPath, storeModulesIndexScriptLines.join('\n'))
}
