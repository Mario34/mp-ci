# 小程序代码上传 ci

⏱ 小程序持续集成 ci

## 特性

- [x] 项目信息暴露
- [ ] 机器人版本号默认配置支持

## 快速配置

- 安装开发依赖

```shell
yarn add @mario34/mp-ci -D
```

- 添加发布脚本 mp-ci.mjs

```js
import packageJson from './package.json'
import path from 'path'
import run from './dist/index.js'

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
  formatDesc(info) {
    // info包含了项目的部分信息，可以用来定制描述
    return packageJson.version
  },
  setting() {
    return {
      es6: true,
      es7: true,
    }
  },
})
```

- 在微信公众平台添加相关配置

登录[微信公众平台](https://mp.weixin.qq.com)，前往 开发=>开发管理=>开发设置=>小程序代码上传，生成上传密钥，开启了上传白名单的话需要把 CI 物理机的 ip 加入到 ip 白名单

## config

| 参数        | 描述                                                                            | 类型     | 默认值                | 必填 |
| ----------- | ------------------------------------------------------------------------------- | -------- | --------------------- | ---- |
| appid       | 小程序 appid                                                                    | string   | /                     | 是   |
| projectPath | 上传代码路径                                                                    | string   | /                     | 是   |
| type        | 显示指明当前的项目类型 miniProgram、miniProgramPlugin、miniGame、miniGamePlugin | string   | miniProgram           | 否   |
| ignores     | 排除的规则                                                                      | string[] | ['node_modules/**/*'] | 否   |
| keyType     | 密钥类型 file/raw                                                               | string   | file                  | 否   |

## cli 参数

需要规范化分支命名

- --key: 上传密钥文件路径
- --branch: 分支名称(分支名称将会被用作生成机器人号码)

```
release-* => ci 机器人 30
version-*.*.* => ci 机器人`${version.patch}`，patch为0时取27
```

## 持续集成

- gitLab

在 CI/CD 设置中配置添加变量，这里需要的是路径，所以变量类型设置为`file`, 在 ci 脚本中添加 `npm run mp-ci --key ${key_path} --branch ${CI_COMMIT_BRANCH}`

- github

在仓库`settings/secrets/actions`添加上传密钥，这里只能给添加文本类型的密钥，所以需要在 mp-ci 配置中添加`"keyType": "raw"`，在 ci 脚本中添加 `npm run mp-ci --key ${{ secrets.key }} --branch ${{GITHUB_REF##*/}}`
