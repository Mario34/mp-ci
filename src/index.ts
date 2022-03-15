import ci from 'miniprogram-ci'
import minimist from 'minimist'
import chalk from 'chalk'
import * as utils from './utils'

import type { MiniProgramCI } from 'miniprogram-ci/dist/@types/types'

export * from './utils'

export type Info = {
  git: {
    branch: string
  } & Record<string, any>
}

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

const tryGet = <T>(target: T | ((_?: any) => T), ...args: any) => {
  if (!target) {
    return null
  }
  if (target instanceof Function) {
    return target(...args)
  }
  return target
}

type ValueFn<T> = T | ((..._: any) => T)

export interface Options {
  config: ValueFn<MiniProgramCI.IProject>
  formatVersion: (info: Info) => string
  formatDesc: (info: Info) => string
  robot: ValueFn<number>
  setting: ValueFn<MiniProgramCI.ICompileSettings>
}

export default (option: Options) => {
  const info: Info = { git: utils.getGitInfo() }
  const {
    config: setupConfig, setting: uploadSetting,
    formatVersion, formatDesc, robot: robotRaw,
  } = option

  let config = tryGet<MiniProgramCI.IProject | null>(setupConfig, info)
  let setting = tryGet<MiniProgramCI.ICompileSettings | null>(uploadSetting, info)
  let robot = tryGet<number>(robotRaw, info)

  checkConfig(config)

  const uploadConfig = {
    desc: formatDesc(info),
    version: formatVersion(info),
    robot: robot ?? 1,
    setting: setting ?? {
      es6: true,
      es7: true,
    },
    onProgressUpdate: (file: MiniProgramCI.ITaskStatus) => {
      if (file.status === 'done') {
        log(chalk.greenBright(`- ${file.message}`))
      }
    },
  }
  devLog(config)
  devLog(uploadConfig)
  devLog(argv)

  const project = new ci.Project(config)
  ci.upload({ project, ...uploadConfig }).then(uploadResult => {
    log(uploadResult)
  }).catch(() => {
    process.exit(1)
  })
  ci.preview({
    project,
    ...uploadConfig,
    onProgressUpdate() {
      // no console
    },
  }).catch(() => {
    process.exit(1)
  })
}
