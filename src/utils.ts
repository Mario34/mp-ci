import { execSync } from 'child_process'

/**
 * 获取git提交信息
 */
export function getGitInfo() {
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
