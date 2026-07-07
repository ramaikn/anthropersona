const fs = require('fs')
const path = require('path')

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return
  }

  fs.mkdirSync(dest, { recursive: true })

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function installPersonas(targetDir) {
  const sourceDir = path.resolve(__dirname, '../../personas')
  const destDir = path.join(targetDir, 'personas')

  if (fs.existsSync(destDir)) {
    console.log('[!] personas/ already exists, skipping copy')
    return false
  }

  copyDir(sourceDir, destDir)
  console.log('[+] Copied personas/ to project')
  return true
}

module.exports = { installPersonas }
