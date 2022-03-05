# 小程序代码上传 ci

⏱ 小程序持续集成 ci，基于[miniprogram-ci]('https://www.npmjs.com/package/miniprogram-ci')实现

## 快速配置

- 安装开发依赖

```shell
yarn add @mario34/mp-ci -D
```

- 添加发布脚本 mp-ci.mjs

```mjs
import path from "path";
import run from "@mario34/mp-ci";
import packageJson from "./package.json";

run({
  config() {
    return {
      appid: "wxsomeappid",
      type: "miniProgram",
      projectPath: path.resolve(process.cwd(), "./dist/"),
      privateKeyPath: path.resolve(process.cwd(), "./dist/"),
      ignores: ["node_modules/**/*"],
    };
  },
  formatVersion() {
    return packageJson.version;
  },
  formatDesc(info) {
    // info包含了项目的部分信息，可以用来定制描述
    return packageJson.version;
  },
  setting() {
    return {
      es6: true,
      es7: true,
    };
  },
});
```

- 添加脚本

```json
{
  "scripts": {
    "ci": "node --experimental-modules --es-module-specifier-resolution=node ./mp-ci.mjs --log"
  }
}
```

- 在微信公众平台添加相关配置

登录[微信公众平台](https://mp.weixin.qq.com)，前往 开发=>开发管理=>开发设置=>小程序代码上传，生成上传密钥，开启了上传白名单的话需要把 CI 物理机的 ip 加入到 ip 白名单

## 配置

### 项目信息

项目信息在配置为函数类型中作为参数暴露，类型如下

```ts
interface Info {
  git: {
    branch: string;
  };
}
```

### config

返回项目配置对象的函数或配置对象

| 参数        | 描述                                                                            | 类型     | 默认值                | 必填 |
| ----------- | ------------------------------------------------------------------------------- | -------- | --------------------- | ---- |
| appid       | 小程序 appid                                                                    | string   | /                     | 是   |
| projectPath | 上传代码路径                                                                    | string   | /                     | 是   |
| type        | 显示指明当前的项目类型 miniProgram、miniProgramPlugin、miniGame、miniGamePlugin | string   | miniProgram           | 否   |
| ignores     | 排除的规则                                                                      | string[] | ['node_modules/**/*'] | 否   |
| keyType     | 密钥类型 file/raw                                                               | string   | file                  | 否   |

### formatVersion

格式化版本号函数，返回版本号字符串，参数为暴露的项目信息

### formatDesc

格式化描述信息函数，返回描述字符串，参数为暴露的项目信息

### setting

上传设置

```ts
interface ICompileSettings {
  es6?: boolean;
  es7?: boolean;
  minify?: boolean;
  codeProtect?: boolean;
  minifyJS?: boolean;
  minifyWXML?: boolean;
  minifyWXSS?: boolean;
  autoPrefixWXSS?: boolean;
  disableUseStrict?: boolean;
}
```
