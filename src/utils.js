const execSync = require('child_process').execSync
const path = require('path')

/**
 * 获取git提交信息
 */
function getLastCommit() {
  /**
   * 格式同 git log --pretty=format
   * %ae - 邮箱
   * %s - 提交说明
   * %cd - 提交日期
   */
  const keyMap = ['%ae', '%s', '%cd', '%ct']
  const valueMap = execSync(`git log -1 --pretty=format:${keyMap.toString().split(',')}`)
    .toString()
    .trim()
    .toString()
    .split(',')
  const info = keyMap.reduce((pre, cur, index) => {
    pre[cur] = valueMap[index]
    return pre
  }, {})
  return `[分支]:${getCliArg('--branch')} [更新内容]:${info['%s']} [开发者]:${info['%ae']}`
}

/**
 * 获取版本对应机器人号码
 */
function getRobot(branch) {
  if (/^release-.+$/.test(branch)) {
    return 30
  }
  const valid = /^version-([1-9]\d|[1-9])((\.([1-9]\d|\d)){1,2}|(\.([1-9]\d|\d)){2}[^\s]+)$/.test(
    branch,
  )
  const patch = branch.split('.').pop()
  if (patch === '0') {
    return 27
  }
  return valid ? patch : 28
}

function getCliArg(key) {
  const args = process.argv
  const index = args.lastIndexOf(key)
  if (index !== -1) {
    return args[index + 1]
  }
}

function pathResolve(str) {
  return path.resolve(process.cwd(), str)
}

module.exports = {
  pathResolve,
  getCliArg,
  getLastCommit,
  getRobot,
}
