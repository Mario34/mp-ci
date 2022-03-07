import packageJson from './package.json'
import path from 'path'
import run, { getRobot } from './dist/index.js'

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
  formatVersion() {
    return packageJson.version
  },
  formatDesc() {
    return packageJson.version
  },
  robot(info) {
    return getRobot(info.git.branch)
  },
  setting: {
    es6: true,
    es7: true,
  },
})
