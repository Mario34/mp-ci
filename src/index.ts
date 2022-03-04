import ci from 'miniprogram-ci'
import minimist from 'minimist'
import chalk from 'chalk'
import path from 'path'
import * as utils from './utils'

import type { MiniProgramCI } from 'miniprogram-ci/dist/@types/types'

const argv = minimist(process.argv.slice(2))
const log = console.log

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

(async () => {
  const info = { git: utils.getLastCommit() }
  const configPath = argv.c ?? path.resolve('mp-ci.config.js')
  const {
    default: {
      config: setupConfig, setting: uploadSetting,
      formatVersion, formatDesc,
    },
  } = await import(configPath)

  console.log(await import(configPath))
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
  log(config)
  log(uploadConfig)
  log(argv)

  const project = new ci.Project(config)
  ci.upload({ project, ...uploadConfig })
})()
