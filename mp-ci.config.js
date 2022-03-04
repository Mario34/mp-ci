import packageJson from './package.json'
import path from 'path'

export default {
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
    console.log(info.git)
    return packageJson.version
  },
  formatDesc(info) {
    console.log(info.git)
    return packageJson.version
  },
  setting() {
    return {
      es6: true,
      es7: true,
      cli: '123',
    }
  },
}
