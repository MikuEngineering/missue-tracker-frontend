const fs = require('fs')
const path = require('path')

const dtoDirPath = path.join(__dirname, '../src/api/dto/')
const dtoIndexScriptPath = path.join(dtoDirPath, 'index.ts')
const dtoNames = fs.readdirSync(dtoDirPath).filter(filename => filename.endsWith('.dto.ts')).map(filename => filename.replace('.dto.ts', ''))
const dtoIndexScriptLines = []

dtoNames.forEach(dtoName => {
  dtoIndexScriptLines.push(`export { default as ${dtoName} } from './${dtoName}.dto'`)
})
dtoIndexScriptLines.push('')

fs.writeFileSync(dtoIndexScriptPath, dtoIndexScriptLines.join('\n'))
