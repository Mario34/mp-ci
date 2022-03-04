import { execSync } from 'child_process'

/**
 * 获取git提交信息
 */
export function getLastCommit() {
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
  const branch = execSync('git rev-parse --abbrev-ref HEAD')
  const info = keyMap.reduce((pre, cur, index) => {
    pre[cur] = valueMap[index]
    return pre
  }, {})
  return `[分支]:${branch} [更新内容]:${info['%s']} [开发者]:${info['%ae']}`
}

/**
 * 获取版本对应机器人号码
 */
export function getRobot(branch) {
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
