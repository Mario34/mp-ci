import packageJson from './package.json'
import path from 'path'
import run from './dist/index.js'

run({
  config() {
    return {
      appid: 'wxsomeappid',
      type: 'miniProgram',
      projectPath: path.resolve(process.cwd(), './dist/'),
      privateKeyPath: path.resolve(process.cwd(), './dist/'),
      ignores: ['node_modules/**/*'],
    }
  },
  formatVersion(info) {
    console.log(info)
    return packageJson.version
  },
  formatDesc() {
    return packageJson.version
  },
  setting() {
    return {
      es6: true,
      es7: true,
    }
  },
})
