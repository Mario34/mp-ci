import ci from 'miniprogram-ci'
import minimist from 'minimist'
import chalk from 'chalk'
import * as utils from './utils'

import type { MiniProgramCI } from 'miniprogram-ci/dist/@types/types'

const argv = minimist(process.argv.slice(2))
const log = console.log
const devLog = (...args) => {
  if (argv.log) {
    log(...args)
  }
}

const checkConfig = (arg: Record<string, any>) => {
  const keys = ['appid', 'projectPath']
  for (let i = 0; i < keys.length; i++) {
    if (!('appid' in arg)) {
      log(chalk.redBright(new Error(`Missing required parameters '${keys[i]}'.`)))
      process.exit()
    }
  }
}

export interface Params {
  argv: {
    privateKeyPath?: string
    privateKey?: string
  } & Record<string, string>
}

const tryGet = <T>(target: T | (() => T)) => {
  if (!target) {
    return null
  }
  if (target instanceof Function) {
    return target()
  }
  return target
}

export default (option) => {
  const info = { git: utils.getGitInfo() }
  const {
    config: setupConfig, setting: uploadSetting,
    formatVersion, formatDesc,
  } = option

  let config = tryGet<MiniProgramCI.IProject | null>(setupConfig)
  let setting = tryGet<MiniProgramCI.ICompileSettings | null>(uploadSetting)

  checkConfig(config)

  const uploadConfig = {
    desc: formatDesc(info),
    version: formatVersion(info),
    setting: setting ?? {
      es6: true,
      es7: true,
    },
  }
  devLog(config)
  devLog(uploadConfig)
  devLog(argv)

  const project = new ci.Project(config)
  ci.upload({ project, ...uploadConfig })
}
