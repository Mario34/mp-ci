import { execSync } from 'child_process'

/**
 * 获取git提交信息
 */
export function getGitInfo(): { branch: string } & Record<string, any> {
  /**
   * git log --pretty=format
   * %ae - 邮箱
   * %d - ref 名称
   * %s - 提交说明
   * %cd - 提交日期
   * %ct - 提交日期
   * %H - commit hash
   * %h - 缩短的 commit hash
   * %an - 作者名字
   */
  const keyMap = ['%ae', '%s', '%cd', '%ct', '%H', '%h', '%an', '%d']
  const valueMap = execSync(`git log -1 --pretty=format:${keyMap.toString().split(',')}`)
    .toString()
    .trim()
    .split(',')
  const branch = execSync('git rev-parse --abbrev-ref HEAD')
  const info = keyMap.reduce((pre, cur, index) => {
    pre[cur] = valueMap[index]
    return pre
  }, {})
  return { ...info, branch: String(branch).trim() }
}

/**
 * 获取版本对应机器人号码
 */
export function getRobot(branch: string): number {
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
  return valid ? +patch : 28
}
