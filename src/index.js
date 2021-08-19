#!/usr/bin/env node
const ci = require('miniprogram-ci')
const utils = require('./utils')
const privateKey = utils.getCliArg('--key')
const branch = utils.getCliArg('--branch')
const packageJson = require(utils.pathResolve('package.json'))
const fs = require('fs')

const config = packageJson['mp-ci'] || {
  appid: 'ddd',
  keyType: 'raw',
  projectPath: '000/999',
}

if (!branch || !privateKey) {
  console.error('缺少必要参数 --key 或 --branch')
  return process.exit(1)
}

let privateKeyPath = privateKey
if (config.keyType === 'raw') {
  const keyPath = utils.pathResolve('./private.key')
  fs.writeFileSync(keyPath, privateKey)
  privateKeyPath = keyPath
}

const project = new ci.Project({
  appid: config.appid,
  type: 'miniProgram',
  projectPath: utils.pathResolve(config.projectPath),
  privateKeyPath,
  ignores: ['node_modules/**/*'],
})

const baseConfig = () => ({
  project,
  version: packageJson.version,
  desc: utils.getLastCommit(),
  robot: utils.getRobot(branch),
  setting: {
    es6: true,
  },
})

ci.upload({
  ...baseConfig(),
  onProgressUpdate: ({ _status, _msg }) => {
    if (_status === 'done') {
      console.log(`🚁  ${_msg}\n`)
    }
  },
})
  .then(({ subPackageInfo }) => {
    console.log(
      '\n🌈 体验版上传成功\n\n' +
        '分包信息：\n' +
        subPackageInfo.reduce((pre, curr) => {
          return pre + `${curr.name}: ${curr.size / 1000}kb\n`
        }, ''),
    )
  })
  .catch((e) => {
    console.log('\n🛠 体验版上传失败\n', e)
    process.exit(1)
  })

ci.preview({
  ...baseConfig(),
  onProgressUpdate: () => {},
  qrcodeFormat: 'base64',
  qrcodeOutputDest: 'qrcode.text',
})
  .then(({ subPackageInfo }) => {
    console.log(
      '\n🌈 预览上传成功\n\n' +
        '分包信息：\n' +
        subPackageInfo.reduce((pre, curr) => {
          return pre + `${curr.name}: ${curr.size / 1000}kb\n`
        }, ''),
    )
  })
  .catch((e) => {
    console.log('\n🛠 预览上传失败\n', e)
    process.exit(1)
  })
