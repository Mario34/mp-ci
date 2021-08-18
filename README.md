# 小程序代码上传ci

⏱ 小程序持续集成ci

## 快速配置

- 安装开发依赖
```shell
yarn add @mario34/mp-ci -D
```

- `package.json`添加配置

```json
{
  "scripts": {
    "mp-ci": "mario34-mp-ci",
  },
  "mp-ci": {
    "appid": "小程序appid",
    "projectPath": "项目地址(相对process.cwd()目录的文件路径)"
  }
}
```

- 在微信公众平台添加相关配置

登录[微信公众平台](https://mp.weixin.qq.com)，前往 开发=>开发管理=>开发设置=>小程序代码上传，生成上传密钥，开启了上传白名单的话需要把CI物理机的ip加入到ip白名单

## cli参数

需要规范化分支命名

- --key: 密钥文件路径
- --branch: 分支名称(分支名称将会被用作生成机器人号码)

```
release-* => ci 机器人 30
version-*.*.* => ci 机器人`${version.patch}`，patch为0时取27
```

## 持续集成

以gitLab为例，在ci脚本中添加 `npm run mp-ci --key ${key_path} --branch ${CI_COMMIT_BRANCH}`
