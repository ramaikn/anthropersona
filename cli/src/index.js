#!/usr/bin/env node

const path = require('path')
const { installPersonas } = require('./copy-personas')
const { installRules } = require('./write-rules')

const cwd = process.cwd()
const pkg = require(path.resolve(__dirname, '../../package.json'))

console.log(`\n  anthropersona v${pkg.version}\n`)
console.log(`  Installing to: ${cwd}\n`)

const personasCopied = installPersonas(cwd)
const rulesWritten = installRules(cwd)

if (personasCopied || rulesWritten) {
  console.log('\n  Done. Personas are ready.\n')
  console.log('  Usage: prefix your prompt with #o, #s, or #f\n')
} else {
  console.log('\n  Nothing to do — personas already installed.\n')
}
