import fs from 'fs/promises'

const overloadsPath = 'src/api/overloads.ts'
const declarationsPath = 'dist/regor.d.ts'

const overloads = await fs.readFile(overloadsPath, 'utf8')
const declarations = overloads
  .split(/\r?\n/)
  .filter((line) => !line.trimStart().startsWith('import '))
  .join('\n')
  .trim()

if (declarations) {
  await fs.appendFile(declarationsPath, `\n${declarations}\n`)
  console.log(`Appended ${overloadsPath} declarations to ${declarationsPath}`)
}
